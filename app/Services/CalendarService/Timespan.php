<?php


namespace App\Services\CalendarService;


use App\Calendar;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Database\Eloquent\Concerns\HasAttributes;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * @property mixed $interval
 * @property mixed $offset
 */
class Timespan implements Arrayable
{
    use HasAttributes;

    private Calendar $calendar;

    public function __construct($attributes, $calendar)
    {
        $this->attributes = $attributes;
        $this->attributes['is_intercalary'] = ($attributes['type'] == 'intercalary');

        $this->calendar = $calendar;
    }

    public function occurrences($year)
    {
        if($this->interval <= 1) {
            return $year;
        }

        # We do this so we keep offset bound within the interval (ie, if offset > interval, year is not subtracted too much)
        $offset = $this->offset % $this->interval;

        return (int) floor(($year - $offset) / $this->interval);
    }

    public function getLeapDaysAttribute()
    {
        return $this->calendar->leap_days->filter->timespanIs($this->id);
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
