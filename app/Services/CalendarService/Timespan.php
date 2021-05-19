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

    public $weekdays;
    public $baseLength;

    private Calendar $calendar;

    public function __construct($attributes, $calendar)
    {
        $this->attributes = $attributes;
        $this->attributes['is_intercalary'] = ($attributes['type'] == 'intercalary');

        $this->calendar = $calendar;
    }

    public function intersectsYear($year)
    {
        $boundOffset = $this->offset % $this->interval;
        return (($year + $boundOffset) % $this->interval) == 0;
    }

    public function occurrences($year)
    {
        $year = ($this->calendar->setting('year_zero_exists'))
            ? $year
            : $year - 1;

        if($this->interval <= 1) {
            return $year;
        }

        # We do this so we keep offset bound within the interval (ie, if offset > interval, year is not subtracted too much)
        $offset = $this->offset % $this->interval;

        if($year < 0 || $this->calendar->setting('year_zero_exists')) {
            if(!$this->calendar->setting('year_zero_exists')) {
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

    public function getLeapDaysAttribute()
    {
        return $this->calendar->leap_days->filter->timespanIs($this->id);
    }

    public function getDaysInYearAttribute()
    {
        $activeLeapDays = $this->leapDays
            ->filter->intersectsYear($this->calendar->year);

        return $this->length + $activeLeapDays->count();
    }

    public function getWeekdaysAttribute()
    {
        $weekdays = collect(Arr::get($this->attributes, 'week', $this->calendar->global_week));

        return $this->insertLeapdaysIntoWeek($weekdays);
    }

    private function insertLeapdaysIntoWeek($weekdays)
	{
        $additiveLeapdays = $this->leapdays
            ->filter->intersectsYear($this->calendar->year)
            ->filter->adds_week_day
            ->sortBy('day')
            ->values();

        if(!$additiveLeapdays->count()){
		    return $weekdays;
        }

        $leapDays = $additiveLeapdays->mapWithKeys(function($leapDay, $leapdayIndex) use($additiveLeapdays) {
			return [($leapDay->day * ($additiveLeapdays->count()+1)) + ($leapdayIndex + 1) => $leapDay->week_day];
		});

        $weekdays = $weekdays->mapWithKeys(function($weekday, $weekdayIndex) use ($additiveLeapdays) {
			return [(($weekdayIndex + 1) * ($additiveLeapdays->count()+1)) => $weekday];
		});

		return $weekdays->union($leapDays)->sortKeys()->values();
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
