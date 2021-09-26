<?php

namespace App\Services\CalendarService;

use App\Calendar;
use Illuminate\Database\Eloquent\Concerns\HasAttributes;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

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

    public function __construct($attributes)
    {
        parent::__construct($attributes);
    }

    /**
     * Counts the non-intercalary days in this month, as pertains to the current year
     *
     * @return int
     */
    public function countNormalDays(): int
    {
        return $this->daysInYear->reject->intercalary->count();
    }

    /**
     * Counts the number of weeks in the year
     *
     * @return int
     */
    public function countWeeksInYear(): int
    {
        return abs(ceil($this->countNormalDays() / $this->weekdays->count()));
    }
    
    public function countDaysInYear(): int
    {
        return $this->daysInYear->count();
    }

    /**
     * Sets up calendar-specific variables on the month
     *
     * @param Calendar $calendar
     * @return $this
     */
    protected function initialize(Calendar $calendar): self
    {
        parent::initialize($calendar);

        $this->activeLeapDays = $this->leapDays
            ->filter->intersectsYear($calendar->year);

        $this->weekdays = $this->buildWeekdays($calendar);

        $this->daysInYear = $this->buildDaysInYear();

        return $this;
    }

    /**
     * Builds the month's base week for the calendar's current year
     *
     * @param Calendar $calendar
     * @return Collection
     */
    private function buildWeekdays(Calendar $calendar): Collection
    {
        $weekdays = collect(Arr::get($this->attributes, 'week', $calendar->global_week));

        return $this->insertLeapdaysIntoWeek($weekdays);
    }

    /**
     * If there are any leaping weekdays in the year, this method inserts them into the month's week
     *
     * @param $weekdays
     * @return Collection
     */
    private function insertLeapdaysIntoWeek($weekdays): Collection
	{
        $additiveLeapdays = $this->activeLeapDays
            ->filter->adds_week_day
            ->sortBy('day')
            ->values();

        if(!$additiveLeapdays->count()) return $weekdays;

        $leapDays = $additiveLeapdays->mapWithKeys(function($leapDay, $leapdayIndex) use($additiveLeapdays) {
			return [($leapDay->day * ($additiveLeapdays->count()+1)) + ($leapdayIndex + 1) => $leapDay->week_day];
		});

        $weekdays = $weekdays->mapWithKeys(function($weekday, $weekdayIndex) use ($additiveLeapdays) {
			return [(($weekdayIndex + 1) * ($additiveLeapdays->count()+1)) => $weekday];
		});

		return $weekdays->union($leapDays)->sortKeys()->values();
	}

    /**
     * This determines how many days there will be in the calendar's current year
     *
     * @return Collection
     */
    private function buildDaysInYear(): Collection
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

    /**
     * Inserts leap days, and intercalary leap days, into the month's days
     *
     * @param $daysInYear
     * @return Collection
     */
    private function insertLeapdaysIntoDaysInYear($daysInYear): Collection
    {
        $intercalaryLeapDays = $this->activeLeapDays->filter->intercalary;

        if($intercalaryLeapDays->count()){
            $offset = 1 / ($intercalaryLeapDays->count()+1);
            $intercalaryLeapDays->each(function($leapDay) use (&$daysInYear, &$offset, $intercalaryLeapDays){
                $day = new MonthDay($leapDay->day+$offset, true, !$leapDay->not_numbered);
                $daysInYear->push($day);
                $offset += 1 / ($intercalaryLeapDays->count()+1);
            });
            $daysInYear = $daysInYear->sortBy('order')->values();
        }

        return $daysInYear;
    }

    public function __toString(): string
    {
        return $this->name;
    }
}
