<?php


namespace App\Services\CalendarService;


use App\Calendar;
use App\Exceptions\InvalidLeapDayIntervalException;
use Illuminate\Support\Arr;

/**
 * Class Interval
 * @package App\Services\CalendarService
 * @property $name
 * @property $intercalary
 * @property $timespan
 * @property $removes_day
 * @property $removes_week_day
 * @property $adds_week_day
 * @property $day
 * @property $week_day
 * @property $interval
 * @property $intervals
 * @property $offset
 * @property mixed not_numbered
 * @property mixed show_text
 */
class LeapDay
{
    public Calendar $calendar;
    private array $originalAttributes;
    public $name;
    public $intercalary;
    public $timespan;
    public $adds_week_day;
    public $day;
    public $week_day;
    public $interval;
    public $offset;
    public $not_numbered;
    public $show_text;

    /**
     * Interval constructor.
     * @param $calendar
     * @param $attributes
     */
    public function __construct(Calendar $calendar, array $attributes)
    {
        $this->originalAttributes = $attributes;
        $this->calendar = $calendar;
        $this->name = Arr::get($attributes, "name");
        $this->intercalary = Arr::get($attributes, "intercalary");
        $this->timespan = $this->calendar->timespans->get(Arr::get($attributes, "timespan"));
        $this->adds_week_day = Arr::get($attributes, "adds_week_day", false);
        $this->day = Arr::get($attributes, "day", 0);
        $this->week_day = Arr::get($attributes, "week_day", false);
        $this->interval = Arr::get($attributes, "interval", "1");
        $this->offset = Arr::get($attributes, "offset", "0");
        $this->not_numbered = Arr::get($attributes, "not_numbered", false);
        $this->show_text = Arr::get($attributes, "show_text", false);

        $this->collectIntervals();
    }

    public function intersectsYear(int $year)
    {
        if($this->intervals->count() === 1) return ['result' => (($year + $this->offset) % $this->interval) == 0];

        $votes = $this->intervals->sortByDesc('years')->map(function($interval) use ($year) {
            $year = ($interval->ignores_offset)
                ? $year
                : $year - $this->offset;

            return $interval->voteOnYear($year);
        });

        //
        foreach($votes as $vote) {
            if($vote == 'allow') return true;
            if($vote == 'deny') return false;
        }

        return false;
    }

    private function collectIntervals()
    {
        $this->intervals = collect(explode(',', $this->interval));

        if(!$this->intervals->count()) {
            throw new InvalidLeapDayIntervalException('An invalid value was provided for the interval of a leap day: ' . $this->interval);
        }

        $this->intervals = $this->intervals->map(function($interval){
            return new Interval($interval);
        });
    }

    public function occurrences($untilYear)
    {
        $untilYear = $this->timespan->occurrences($untilYear);
        return collect(range(0, $untilYear))
            ->filter(function($year){
                return $this->intersectsYear($year);
            })
            ->count();
    }

    public function occurrencesOnMonthBetweenYears($start, $end, $month)
    {
        if($this->intervals->filter->ignores_offset->count() < 1 && $this->intervals->filter->negated->count() < 1) {
            return $this->intervals
                ->map(function($interval) use ($end) {
                    return $interval->contributionToYear($end);
                })->sum();
        }

        dd($this->interval);

        dd($this->intervals->map(function($interval){
            return $interval->contributionToYear($year);
        }));
    }

    public function timespanIs($timespan_id)
    {
        return $this->timespan === $timespan_id;
    }

    public function toArray()
    {
        return collect(array_keys($this->originalAttributes))
            ->mapWithKeys(function($name){ return [ $name => $this->{$name}]; })
            ->toArray();
    }

    public function __get($name)
    {
        return Arr::get($this->originalAttributes, $name);
    }
}
