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
 */
class LeapDay
{
    private array $attributes;

    /**
     * Interval constructor.
     * @param $attributes
     */
    public function __construct(array $attributes)
    {
        $this->attributes = $attributes;

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

    public function __get($name)
    {
        return Arr::get($this->attributes, $name);
    }
}
