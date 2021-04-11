<?php

namespace App\Services\CalendarService;

use App\Calendar;
use Illuminate\Support\Arr;

class Month
{
    private $calendar;
    private $length = 0;
    private $weeks;

    public $weekdays;

    public function __construct(Calendar $calendar)
    {
        $this->calendar = $calendar;
        $this->weeks = collect();
        $this->firstEpoch = new Epoch($this->calendar, $this->calendar->year, $this->calendar->month_index, 0);
        $this->id = $this->firstEpoch->month_id;
        $this->attributes = $this->calendar->timespans->pull($this->id);
        $this->baseLength = $this->attributes['length'];
        
        $this->initialize();
    }

    public function getStructure()
    {
        return;
    }
    
    private function initialize()
    {
        $this->weekdays = $this->buildWeekdays();
    }

    private function buildWeekdays()
    {
        $weekdays = collect(Arr::get($this->attributes, 'week', $this->calendar->global_week));
        $leapDays = $calendar->leap_days
				 ->where('timespan', '=', $this->id)
				 ->filter->intersectsYear($this->calendar->year)
                 ->where('adds_week_day', '=', true)
                 ->sortBy('day')
                 ->values();

        return $this->insertLeapdaysIntoWeek($weekdays, $leapDays)
    }

    private function insertLeapdaysIntoWeek($weekdays, $leapDays)
	{
		$leapdaysCount = $leapDays->count();
		$leapDays = $leapDays->mapWithKeys(function($leapDay, $leapdayIndex) use ($leapdaysCount){
			return [($leapDay['day'] * ($leapdaysCount+1)) + $leapdayIndex => $leapDay['week_day']];
		});

		$weekdays = $weekdays->mapWithKeys(function($weekday, $weekdayIndex) use ($leapdaysCount) {
			return [(($weekdayIndex + 1) * $leapdaysCount) => $weekday];
		});

		return $weekdays->union($leapDays)->sortKeys()->values();
	}
}