<?php


namespace App\Services\EpochService\Processor;


use App\Calendar;
use App\Facades\Epoch;
use App\Services\EpochService\Traits\CalculatesAndCachesProperties;

class InitialState
{
    use CalculatesAndCachesProperties;

    protected Calendar $calendar;

    /**
     * State constructor.
     * @param $calendar
     * @param null $nextYearState
     */
    public function __construct($calendar)
    {
        $this->calendar = $calendar;
        $this->statecache = collect();
    }

    public static function generateFor($calendar)
    {
        return (new self($calendar))->generateInitialProperties();
    }

    public function generateInitialProperties()
    {
        // Generate and set any initial properties used for the initial state

        dump([
            'epoch' => $this->epoch,
            'numTimespans' => $this->numTimespans,
            'totalWeekNum' => $this->totalWeekNum,
            'historicalIntercalaryCount' => $this->historicalIntercalaryCount,
            'weekday' => $this->weekday,
            'timespanCounts' => $this->timespanCounts,
        ]);

        dd($this->calendar->dynamic_data);

        return collect([
            'epoch' => $this->epoch,
            'numTimespans' => $this->numTimespans,
            'totalWeekNum' => $this->totalWeekNum,
            'historicalIntercalaryCount' => $this->historicalIntercalaryCount,
            'weekday' => $this->weekday,
            'timespanCounts' => $this->timespanCounts
        ]);
    }

    //
    private function calculateEpoch()
    {
        return $this->totalDaysFromTimespans
            + $this->totalLeapdayOccurrences;
    }

    private function calculateTotalDaysFromTimespans()
    {
        return $this->calendar->timespans->sum(function($timespan){
            return $timespan->occurrences($this->year) * $timespan->length;
        });
    }

    private function calculateTimespanOccurrences()
    {
        return $this->calendar->timespans->map->occurrences($this->year);
    }

    private function calculateTotalLeapdayOccurrences()
    {
        return $this->leapDayOccurrences->sum();
    }

    private function calculateLeapdayOccurrences()
    {
        return $this->calendar->leap_days->map->occurrencesOnMonthBetweenYears($this->epochStartYear, $this->year, 0);
    }

    private function calculateNumTimespans()
    {
        return $this->calendar->timespans
            ->filter(function($timespan){
                return !$timespan->intercalary;
            })
            ->map->occurrences($this->year)
            ->sum();
    }

    private function calculateTotalWeekNum()
    {
        if($this->calendar->overflows_week){
			return intval(floor(($this->epoch - $this->historicalIntercalaryCount) / count($this->calendar->global_week)));
		}else{
            return $this->calendar->timespans->sum(function($timespan){
                $timespanDays = $timespan->occurrences($this->year) * $timespan->length;
                $weekLength = count($timespan->week ?? $this->calendar->global_week))
                return abs(ceil($timespanDays/$weekLength));
            });
        }
    }

    private function calculateHistoricalIntercalaryCount()
    {
        $leapDayIntercalaryDays = $this->calendar->leap_days
            ->filter(function($leap_day){
                return $leap_day->intercalary;
            })
            ->sum(function($leap_day){
                return $leap_day->occurrencesOnMonthBetweenYears($this->epochStartYear, $this->year, 0);
            });

        $timespanIntercalaryDays = $this->calendar->timespans
            ->filter(function($timespan){
                return $timespan->intercalary;
            })
            ->sum(function($timespan){
                return $timespan->occurrences($this->year) * $timespan->length;
            });

        return $leapDayIntercalaryDays + $timespanIntercalaryDays;
    }

    private function calculateTimespanCounts()
    {
        return $this->calendar->timespans->map(function($timespan){
            return $timespan->occurrences($this->year);
        });
    }

    private function calculateWeekday()
    {
        $weekdaysCount = count($this->calendar->global_week);
        $calendarFirstWeekdayIndex = intval($this->calendar->first_day);
        $totalWeekdaysBeforeToday = ($this->epoch - $this->historicalIntercalaryCount + $calendarFirstWeekdayIndex);

        $weekday = $totalWeekdaysBeforeToday % $weekdaysCount;

        // If we're on a negative year, the result is negative, so add weekdays to result
	    return ($weekday < 0)
	        ? $weekday + $weekdaysCount
	        : $weekday;
    }

    private function calculateYear()
    {
        return $this->calendar->year;
    }

    private function calculateEpochStartYear()
    {
        return $this->calendar->setting('year_zero_exists')
            ? 0
            : 1;
    }
}

// |------------|---------------------|
//              ^                     ^
//          Era start           Next year start
