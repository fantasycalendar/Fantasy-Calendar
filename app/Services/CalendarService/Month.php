<?php

namespace App\Services\CalendarService;

use App\Calendar;
use Illuminate\Database\Eloquent\Concerns\HasAttributes;
use Illuminate\Support\Arr;

class Month extends Timespan
{
    use HasAttributes;

    public $weekdays;
    /**
     * @var mixed
     */
    public $daysInYear;
    /**
     * @var array|\ArrayAccess|mixed
     */
    public $activeLeapDays;

    public function __construct($attributes, Calendar $calendar)
    {
        parent::__construct($attributes, $calendar);
        $this->initialize();
    }

    private function initialize()
    {
        $this->activeLeapDays = $this->leapDays
            ->filter->intersectsYear($this->calendar->year);

        $this->weekdays = $this->buildWeekdays();

        $this->daysInYear = $this->buildDaysInYear();

        return $this;
    }

    private function buildWeekdays()
    {
        $weekdays = collect(Arr::get($this->attributes, 'week', $this->calendar->global_week));

        return $this->insertLeapdaysIntoWeek($weekdays);
    }

    private function buildDaysInYear()
    {
        if($this->intercalary){
            $baseLength = $this->length + $this->activeLeapDays->count();
        }else{
            $baseLength = $this->length + $this->activeLeapDays->reject->intercalary->count();
        }

        $baseLengthArray = array_fill(0, $baseLength, $this->intercalary);

        return $this->insertLeapdaysIntoDaysInYear($baseLengthArray);

    }

    private function insertLeapdaysIntoDaysInYear($baseLengthArray)
    {

        $baseLengthArray = collect($baseLengthArray);

        $intercalaryLeapDays = $this->activeLeapDays->filter->intercalary;

        if($intercalaryLeapDays->count()){
            $offset = 0;
            $intercalaryLeapDays->each(function($leapDay) use (&$baseLengthArray, &$offset){
                $baseLengthArray->splice($leapDay->day+$offset, 0, true);
                $offset++;
            });
        }

        return $baseLengthArray;

    }

    private function insertLeapdaysIntoWeek($weekdays)
	{
        $additiveLeapdays = $this->activeLeapDays
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
}
