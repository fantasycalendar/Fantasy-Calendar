<?php


namespace App\Services\CalendarService;


use App\Calendar;
use App\Collections\IntervalsCollection;
use App\Exceptions\InvalidLeapDayIntervalException;
use FontLib\Table\Type\post;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * Class Interval
 * @package App\Services\CalendarService
 * @property $name
 * @property $intercalary
 * @property $timespan_id
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
    public bool $yearZeroExists;
    private array $originalAttributes;
    public $name;
    public $intercalary;
    public $timespan_id;
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
        $this->yearZeroExists = $calendar->setting('year_zero_exists');;
        $this->name = Arr::get($attributes, "name");
        $this->intercalary = Arr::get($attributes, "intercalary");
        $this->timespan_id = Arr::get($attributes, "timespan");
        $this->adds_week_day = Arr::get($attributes, "adds_week_day", false);
        $this->day = Arr::get($attributes, "day", 0);
        $this->week_day = Arr::get($attributes, "week_day", false);
        $this->interval = Arr::get($attributes, "interval", "1");
        $this->offset = Arr::get($attributes, "offset", "0");
        $this->not_numbered = Arr::get($attributes, "not_numbered", false);
        $this->show_text = Arr::get($attributes, "show_text", false);

        $this->intervals = IntervalsCollection::fromString($this->interval, $this->offset)->normalize();
    }

    /**
     * Determines whether this leap day will appear on the given year
     *
     * @param int $year
     * @return bool
     */
    public function intersectsYear(int $year): bool
    {
        $votes = $this->intervals->sortByDesc('years')->map(function($interval) use ($year) {
            return $interval->voteOnYear($year);
        });

        foreach($votes as $vote) {
            if($vote == 'allow') return true;
            if($vote == 'deny') return false;
        }

        return false;
    }

    /**
     * Determines how many times this leap day has appeared up until the given year, or how
     * many times it has appeared depending on the occurrences of the month that owns it
     *
     * @param int $parentOccurrences
     * @return int
     */
    public function occurrences(int $parentOccurrences): int
    {
        return (int) $this->intervals->occurrences($parentOccurrences, $this->yearZeroExists);
    }

    /**
     * @param $timespan_id
     * @return bool
     */
    public function timespanIs($timespan_id): bool
    {
        return $this->timespan_id === $timespan_id;
    }

    /**
     * @return int
     */
    public function getAverageYearContributionAttribute(): float
    {
        return $this->intervals->sum->fraction();
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return collect(array_keys($this->originalAttributes))
            ->mapWithKeys(function($name){ return [ $name => $this->{$name}]; })
            ->toArray();
    }

    public function __get($key)
    {
        if(method_exists($this, 'get'.Str::studly($key).'Attribute')) {
            return $this->{'get'.Str::studly($key).'Attribute'}();
        }

        return Arr::get($this->originalAttributes, $key);
    }
}
