<?php


namespace App\Services\EpochService\Processor;


use App\Calendar;
use App\Facades\Epoch;
use App\Services\EpochService\Traits\CalculatesAndCachesProperties;
use Illuminate\Support\Facades\Log;

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
        Log::info('ENTERING: '. self::class . '::__construct');
        $this->calendar = $calendar;
        $this->statecache = collect();
    }

    public static function generateFor($calendar)
    {
        Log::info('ENTERING: '. self::class . '::generateFor');
        return (new self($calendar))->generateInitialProperties();
    }

    public function generateInitialProperties()
    {
        Log::info('ENTERING: '. self::class . '::generateInitialProperties');
        // Generate and set any initial properties used for the initial state

        return $this;
    }

    public function collect()
    {
        Log::info('ENTERING: '. self::class . '::collect');
        return collect($this->toArray());
    }

    public function toArray()
    {
        Log::info('ENTERING: '. self::class . '::toArray');
        return [
            'day' => 1,
            'month' => 0,
            'year' => $this->year,
            'epoch' => $this->epoch,
            'numberTimespans' => $this->numberTimespans,
            'historicalIntercalaryCount' => $this->historicalIntercalaryCount,
            'weekdayIndex' => $this->weekdayIndex,
            'timespanCounts' => $this->timespanCounts
        ];
    }

    //
    private function calculateEpoch()
    {
        Log::info('ENTERING: '. self::class . '::calculateEpoch');

        return $this->totalDaysFromTimespans
            + $this->totalLeapdayOccurrences;
    }

    private function calculateTotalDaysFromTimespans()
    {
        Log::info('ENTERING: '. self::class . '::calculateTotalDaysFromTimespans');
        return $this->calendar->timespans->sum(function($timespan){
            return $timespan->occurrences($this->year) * $timespan->length;
        });
    }

    private function calculateTotalLeapdayOccurrences()
    {
        Log::info('ENTERING: '. self::class . '::calculateTotalLeapdayOccurrences');
        return $this->calendar->timespans->sum(function($timespan){
            $timespanOccurrences = $timespan->occurrences($this->year);
            return $timespan->leapDays->sum(function($leapDay) use ($timespanOccurrences, $timespan){
                $occurrences = $leapDay->occurrences($timespanOccurrences);
                return $occurrences;
            });
        });
    }

    private function calculateHistoricalIntercalaryCount()
    {
        Log::info('ENTERING: '. self::class . '::calculateHistoricalIntercalaryCount');

        return $this->calendar->timespans->sum(function($timespan){
            $timespanOccurrences = $timespan->occurrences($this->year);
            $timespanIntercalaryDays = $timespan->intercalary ? $timespanOccurrences * $timespan->length : 0;
            $leapDayIntercalaryDays = $timespan->leapDays->sum(function($leapDay) use ($timespanOccurrences, $timespan){
                return $leapDay->intercalary || $timespan->intercalary ? $leapDay->occurrences($timespanOccurrences) : 0;
            });
            return $timespanIntercalaryDays + $leapDayIntercalaryDays;
        });
    }

    private function calculateTimespanCounts()
    {
        Log::info('ENTERING: '. self::class . '::calculateTimespanCounts');
        return $this->calendar->timespans
            ->map->occurrences($this->year);
    }

    private function calculateNumberTimespans()
    {
        Log::info('ENTERING: '. self::class . '::calculateNumberTimespans');
        return $this->calendar->timespans
            ->map->occurrences($this->year)
            ->sum();
    }

    private function calculateWeekdayIndex()
    {
        if(!$this->calendar->overflows_week) return 0;

        $weekdaysCount = count($this->calendar->global_week);
        $firstWeekdayIndex = intval($this->calendar->first_day);
        $totalWeekdaysBeforeToday = ($this->epoch - $this->historicalIntercalaryCount + $firstWeekdayIndex);

        $weekday = $totalWeekdaysBeforeToday % $weekdaysCount;

        // If we're on a negative year, the result is negative, so add weekdays to result
	    return ($weekday < 0)
	        ? $weekday + $weekdaysCount
	        : $weekday;
    }

    private function calculateYear(){
        return $this->calendar->year;
    }

    private function calculateEpochStartYear()
    {
        Log::info('ENTERING: '. self::class . '::calculateEpochStartYear');
        return $this->calendar->setting('year_zero_exists')
            ? 0
            : 1;
    }
}

// |------------|---------------------|
//              ^                     ^
//          Era start           Next year start
