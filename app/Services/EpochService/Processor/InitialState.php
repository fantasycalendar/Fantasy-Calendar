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
            'totalWeekNumber' => $this->totalWeekNumber,
            'historicalIntercalaryCount' => $this->historicalIntercalaryCount,
            'weekday' => $this->weekday,
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
//                dump("Timespan {$timespan->name} occurrences: " . $timespanOccurrences);
                $occurrences = $leapDay->occurrences($timespanOccurrences);
//                dump("Leap day {$leapDay->name} occurrences: " . $occurrences);
//                dump($occurrences);
                return $occurrences;
            });
        });
    }

    private function calculateHistoricalIntercalaryCount()
    {
        Log::info('ENTERING: '. self::class . '::calculateHistoricalIntercalaryCount');

        $intercalaryTimespans = $this->calendar->timespans->filter->intercalary;

        $timespanIntercalaryDays = $intercalaryTimespans->sum(function($timespan){
            return $timespan->occurrences($this->year) * $timespan->length;
        });

        $leapDayIntercalaryDays = $intercalaryTimespans->sum(function($timespan){
            $timespanOccurrences = $timespan->occurrences($this->year);
            return $timespan->leapDays->filter->intercalary->sum(function($leapDay) use ($timespanOccurrences){
                return $leapDay->occurrences($timespanOccurrences);
            });
        });

        return $leapDayIntercalaryDays + $timespanIntercalaryDays;
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

    private function calculateTotalWeekNumber()
    {
        Log::info('ENTERING: '. self::class . '::calculateTotalWeekNumber');
        if($this->calendar->overflows_week){
			return intval(floor(($this->epoch - $this->historicalIntercalaryCount) / count($this->calendar->global_week)));
		}

        return $this->calendar->timespans->sum(function($timespan){
            $timespanDays = $timespan->occurrences($this->year) * $timespan->length;
            $weekLength = count($timespan->week ?? $this->calendar->global_week);
            return abs(ceil($timespanDays/$weekLength));
        });
    }

    private function calculateWeekday()
    {
        Log::info('ENTERING: '. self::class . '::calculateWeekday');
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