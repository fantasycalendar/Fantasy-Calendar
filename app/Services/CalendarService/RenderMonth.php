<?php

namespace App\Services\CalendarService;

use App\Calendar;
use App\Facades\Epoch;
use Illuminate\Support\Str;

class RenderMonth
{
    public $calendar;
    private $id;
    private int $intercalary_weeks_count = 0;

    public function __construct(Calendar $calendar, $id = null)
    {
        $this->calendar = $calendar;
        $this->id = $id ?? $calendar->month_index;
    }

    /*
     * Returns an 2-dimensional array in the format:
     *
     */
    public function getStructure()
    {
        $epochs = Epoch::forCalendarMonth($this->calendar);

        $weeks = $epochs->chunkByWeeks()->map(function($week){
            return $week->map(function($week){
                $weekdays = collect(range(0, $this->weekdays->count() - 1));

                if($week->filter->isIntercalary->count() > 0) {
                    return $weekdays->slice($week->count())->prepend($week->sortBy('day'))->flatten();
                }

                return $weekdays->mapWithKeys(function($index) use ($week) {
                    return [$index => $week->where('weekdayIndex', $index)->first()];
                });
            });
        });

        $cleanWeekDays = $this->cleanWeekdays($this->weekdays);

        return [
            'year' => $this->calendar->year,
            'month' => $this->calendar->render_month,
            'name' => $this->name,
            'length' => $this->daysInYear->count(),
            'weekdays' => $this->weekdays,
            'week_length' => $this->weekdays->count(),
            'weeks_count' => $this->calculateWeeksCount($weeks),
            'intercalary_weeks_count' => $this->intercalary_weeks_count,
            'clean_weekdays' => $cleanWeekDays,
            'weeks' => $weeks,
            'min_day_text_length' => max($this->findShortestUniquePrefixLength($cleanWeekDays), strlen($this->length))
        ];
    }

    public function __get($name)
    {
        return $this->calendar->months[$this->id]->$name;
    }

    /**
     * Recursively determine the shortest we can make our weekday name(s), while
     * still keeping the resulting values unique. As an example, if we have days
     * like 'First' and 'Fifth', for example, 'Fir' and 'Fif' are unique,
     * while 'Fi' and 'Fi' are not. So we only shorten as far as we can.
     *
     * @param $weekdays
     * @param null $length
     * @return int|mixed
     */
    private function findShortestUniquePrefixLength($weekdays, $length = null): int
    {
        log_json($weekdays);
        $length = $length ?? $weekdays->map(function($weekday) {
                return strlen($weekday);
            })->max();

        $matchedShortNames = $weekdays->countBy(function($dayName) use ($length) {
            return Str::limit($dayName, $length, '');
        })->max();

        return ($matchedShortNames === 1)
            ? $this->findShortestUniquePrefixLength($weekdays, $length - 1) // All unique, check one more level
            : max($length + 1, 3); // Found duplicates! That means our length is truncating too far.
    }

    private function cleanWeekdays($weekdays)
    {
        if($weekdays->count() === $weekdays->filter(fn($day) => is_numeric(str_replace('Weekday ', '', $day)))->count()) {
            return $weekdays->map(fn($day) => str_replace('Weekday ', '', $day));
        }

        return $weekdays
            ->map(fn($day) => words_to_number($day));
    }

    private function calculateWeeksCount($weeks)
    {
        return $weeks->map(function($week){
            return $week->map(function($visualWeek){
                if($visualWeek->filter(fn($day) => optional($day)->isIntercalary)->count()){
                    $this->intercalary_weeks_count++;
                }

                return ceil($visualWeek->count() / $this->weekdays->count());
            })->sum();
        })->sum();
    }

}
