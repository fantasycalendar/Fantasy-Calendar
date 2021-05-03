<?php

namespace App\Services\CalendarService;

use App\Calendar;
use Illuminate\Database\Eloquent\Concerns\HasAttributes;
use Illuminate\Support\Arr;

class Month
{
    use HasAttributes;

    private $calendar;
    private $length = 0;
    private $weeks;

    public $weekdays;
    /**
     * @var Epoch
     */
    private Epoch $firstEpoch;
    private $id;
    /**
     * @var mixed
     */
    private $baseLength;

    public function __construct(Calendar $calendar)
    {
        $this->calendar = $calendar;
        $this->weeks = collect();

        $firstEpoch = new Epoch($this->calendar, $this->calendar->year, $this->calendar->month_index, 0);
        $this->firstEpoch = $firstEpoch;
        $this->id = $firstEpoch->month_id;
        $this->attributes = $this->calendar->timespans->pull($firstEpoch->month_id)->toArray();
        $this->baseLength = $this->attributes['length'];

        $this->initialize();
    }

    /*
     * Returns an 2-dimensional array in the format:
     *
     */
    public function getStructure()
    {
        $this->initialize();
        $weeksInMonth = $this->buildWeekList();

        $monthDay = 0;
        $structure = $weeksInMonth->mapWithKeys(function($weekNumber) use (&$monthDay){
            return [
                $weekNumber => collect($this->calendar->month_week)->map(function($day) use (&$monthDay){
                    $monthDay++;

                    return ['month_day' => ($monthDay > $this->calendar->month_true_length) ? null : $monthDay];
                })
            ];
        });

        return [
            'year' => $this->calendar->year,
            'name' => $this->name,
            'length' => $this->length,
            'weekdays' => $this->weekdays,
            'weeks' => $structure
        ];
    }

    private function buildWeekList()
    {

        $weeks_in_month = ceil($this->month_length / count($this->calendar->month_week));

        return collect(
            range(1, $weeks_in_month)
        );
    }
    private function initialize()
    {
        $this->weekdays = $this->buildWeekdays();

        return $this;
    }

    private function buildWeekdays()
    {
        $weekdays = collect(Arr::get($this->attributes, 'week', $this->calendar->global_week));
        $leapDays = $this->calendar->leap_days
				 ->where('timespan', '=', $this->id)
				 ->filter->intersectsYear($this->calendar->year)
                 ->where('adds_week_day', '=', true)
                 ->sortBy('day')
                 ->values();

        return $this->insertLeapdaysIntoWeek($weekdays, $leapDays);
    }

    private function insertLeapdaysIntoWeek($weekdays, $leapDays)
	{
		$leapdaysCount = $leapDays->count();

		if($leapdaysCount == 0){
		    return $weekdays;
        }

		$leapDays = $leapDays->mapWithKeys(function($leapDay, $leapdayIndex) use ($leapdaysCount){
			return [($leapDay['day'] * ($leapdaysCount+1)) + $leapdayIndex => $leapDay['week_day']];
		});

		$weekdays = $weekdays->mapWithKeys(function($weekday, $weekdayIndex) use ($leapdaysCount) {
			return [(($weekdayIndex + 1) * $leapdaysCount) => $weekday];
		});

		return $weekdays->union($leapDays)->sortKeys()->values();
	}

    public function __get($name)
    {
        return Arr::get($this->attributes, $name);
    }
}
