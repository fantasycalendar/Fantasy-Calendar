<?php


namespace App\Services\CalendarService;


use App\Calendar;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Database\Eloquent\Concerns\HasAttributes;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * @property mixed $interval
 * @property mixed $offset
 */
class Timespan implements Arrayable
{
    use HasAttributes;

    protected bool $yearZeroExists;
    public Collection $leapDays;

    public function __construct($attributes)
    {
        $this->attributes = $attributes;
        $this->attributes['intercalary'] = ($attributes['type'] == 'intercalary');
        $this->leapDays = collect([]);
    }

    /**
     * Sets the timespan to use a specific calendar, and initializes it for further use
     *
     * @param Calendar $calendar
     */
    public function setCalendar(Calendar $calendar)
    {
        $this->initialize($calendar);
    }

    /**
     * Sets up calendar-specific variables on the timespan
     *
     * @param Calendar $calendar
     * @return $this
     */
    protected function initialize(Calendar $calendar): self
    {
        $this->yearZeroExists = $calendar->setting('year_zero_exists');
        $this->leapDays = $calendar->leapDays->filter->timespanIs($this->id);
        return $this;
    }

    /**
     * Determines whether this timespan appears on the given year
     *
     * @param $year
     * @return bool
     */
    public function intersectsYear($year): bool
    {
        $boundOffset = $this->offset % $this->interval;
        return (($year + $boundOffset) % $this->interval) == 0;
    }

    /**
     * Determines the number of times this timespan has appeared up until the given year
     *
     * @param $year
     * @return int
     */
    public function occurrences($year): int
    {
        $year = ($this->yearZeroExists)
            ? $year
            : $year - 1;

        if($this->interval <= 1 )return $year;

        # We do this so we keep offset bound within the interval (ie, if offset > interval, year is not subtracted too much)
        $offset = $this->offset % $this->interval;

        if($year < 0 || $this->yearZeroExists) {
            if(!$this->yearZeroExists) {
                $offset--;
            }
            return (int) ceil(($year - $offset) / $this->interval);
        }else{
            if($offset > 0){
                return (int) floor(($year + $this->interval - $offset) / $this->interval);
            }
        }

        return (int) floor($year / $this->interval);
    }

    public function toArray(): array
    {
        return $this->attributes;
    }

    public function __get($key)
    {
        if(method_exists($this, 'get'.Str::studly($key).'Attribute')) {
            return $this->{'get'.Str::studly($key).'Attribute'}();
        }

        return Arr::get($this->attributes, $key);
    }
}
