<?php


namespace App\Services\CalendarService;


use App\Calendar;
use App\Collections\IntervalsCollection;
use App\Exceptions\InvalidLeapDayIntervalException;
use FontLib\Table\Type\post;
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

        $this->intervals = IntervalsCollection::fromString($this->interval, $this->offset)->normalize();
    }

    public function intersectsYear(int $year)
    {
        if($this->intervals->count() === 1) return ['result' => (($year + $this->offset) % $this->interval) == 0];

        $votes = $this->intervals->sortByDesc('years')->map(function($interval) use ($year) {
            return $interval->voteOnYear($year);
        });

        //
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
        return (int) $this->intervals->occurrences($parentOccurrences, $this->calendar->setting('year_zero_exists'));
    }

    public function timespanIs($timespan_id)
    {
        return $this->timespan->id === $timespan_id;
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
