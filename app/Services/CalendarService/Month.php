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

        $daysInYear = collect([])->times($baseLength, function($index){
            return new MonthDay($index, $this->intercalary);
        });

        if($this->intercalary) {
            return $daysInYear;
        }

        return $this->insertLeapdaysIntoDaysInYear($daysInYear);

    }

    private function insertLeapdaysIntoDaysInYear($daysInYear)
    {

        $intercalaryLeapDays = $this->activeLeapDays->filter->intercalary;

        if($intercalaryLeapDays->count()){
            $offset = 1 / ($intercalaryLeapDays->count()+1);
            $intercalaryLeapDays->each(function($leapDay) use (&$daysInYear, &$offset, $intercalaryLeapDays){
                $day = new MonthDay($leapDay->day+$offset, true);
                $daysInYear->push($day);
                $offset += 1 / ($intercalaryLeapDays->count()+1);
            });
            $daysInYear = $daysInYear->sortBy('order')->values();
        }

        return $daysInYear;

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
