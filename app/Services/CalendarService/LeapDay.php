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
    private array $originalAttributes;
    public string $name;
    public bool $intercalary;
    public int $timespan;
    public bool $adds_week_day;
    public int $day;
    public $week_day;
    public string $interval;
    public int $offset;
    public bool $not_numbered;
    public bool $show_text;

    /**
     * Interval constructor.
     * @param $attributes
     */
    public function __construct(array $attributes)
    {
        foreach($attributes as $key => $value) {
            $this->{$key} = $value;
        }

        $this->originalAttributes = $attributes;
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

    public function occurrences($timespan_occurrences)
    {
        return $timespan_occurrences;
    }

    public function timespanIs($timespan_id)
    {
        return $this->timespan === $timespan_id;
    }

    public function __get($name)
    {
        return Arr::get($this->originalAttributes, $name);
    }
}
