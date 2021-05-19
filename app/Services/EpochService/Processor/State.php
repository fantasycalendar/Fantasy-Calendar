<?php


namespace App\Services\EpochService\Processor;


use App\Calendar;
use App\Services\EpochService\Traits\CalculatesAndCachesProperties;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class State
{
    use CalculatesAndCachesProperties;

    public $day = 1;
    protected $calendar;
    protected \Illuminate\Support\Collection $previousState;
    protected \Illuminate\Support\Collection $nextYearState;

    /**
     * State constructor.
     * @param $calendar
     * @param null $nextYearState
     */
    public function __construct($calendar)
    {
//        Log::info('ENTERING: ' . self::class . '::__construct');
        $this->calendar = $calendar;

        Log::info('initing state');
        Log::info($calendar->dynamic_data);

        $this->initialize();
    }

    private function initialize()
    {
//        Log::info('ENTERING: ' . self::class . '::initialize');
        $this->statecache = InitialStateWithEras::generateFor($this->calendar)->collect();
//        $this->nextYearState = InitialStateWithEras::generateFor($this->calendar->addYear()->startOfYear())->collect();
    }

    public function advance()
    {

        //        Log::info('ENTERING: ' . self::class . '::advance');
        $this->day++;
        $this->epoch++;

        dump($this->toArray());

        $this->flushCache();
    }

    public function basics()
    {
//        Log::info('ENTERING: ' . self::class . '::basics');
        return  [
            // Information that doesn't need next year's state
        ];
    }

    public function toArray(): array
    {
//        Log::info('ENTERING: ' . self::class . '::toArray');
        return [
            'year' => $this->year,
            'month' => $this->month,
            'day' => $this->day,
            'epoch' => $this->epoch,
            'monthIndex' => $this->monthIndex
        ];
    }

    /*
     * Month in the **displayed** year, zero-indexed
     */
    private function calculateMonth()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateMonth');
        // Compare current day to the previous day's month length
        if(!$this->previousState->has('month')) {
            return 0;
        }

        if($this->day > $this->monthLength) {

            $this->day = 0;
            $this->statecache->forget('monthLength');
            $this->statecache->forget('monthIndex');

            if($this->previousState->get('month')+1 >= count($this->months)){
                $this->year++;
                $this->statecache->forget('months');
                return 0;
            }

            return $this->previousState->get('month')+1;

        }

        return $this->previousState->get('month');
    }

    private function calculateMonthLength()
    {

        if(!$this->previousState->has('monthLength')) {
            return $this->months->get($this->previousState->get('month'))->daysInYear;
        }

        return $this->previousState->get('monthLength');

    }

    private function calculateMonthIndex()
    {
        if(!$this->previousState->has('monthIndex')) {
            return $this->months->get($this->previousState->get('month'))->id;
        }

        return $this->previousState->get('monthIndex');
    }

    private function calculateMoonPhases()
    {
        return $this->calendar->moons
            ->map(function($moon) {
                return $moon->setEpoch($this->epoch)->getPhases();
            });
    }

    private function calculateMonths()
    {
        if(!$this->previousState->has('months')){
            return $this->calendar->months;
        }
        return $this->previousState->get('months');
    }

    private function calculateYear()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateYear');
        if($this->day === 0) {
            return ($this->calendar->year_zero_exists)
                ? 0
                : 1;
        }

        return $this->previousState->get('year');
    }

    private function calculateFirstYearLength()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateFirstYearLength');
        // Do some epic shit here

        return (int) floor($this->day / $this->firstYearTimespanLengths);
    }

    private function calculateFirstYearTimespanLengths()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateFirstYearTimespanLengths');
        return $this->calendar->timespans
            ->filter(function($timespan){
                return ($timespan->is_intercalary)
                    ? ($timespan->offset == 1 && $timespan->interval == 1)
                    : true;
            })->map(function($timespan){
                return $timespan->length + $this->calendar->leap_days
                    ->filter->timespanIs($timespan->id)
                    ->filter->intersectsYear(0)
                    ->count();
            });
    }

    private function calculateEpoch()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateEpoch');

        if(!$this->previousState->has('epoch')){
            return $this->totalDaysFromTimespans
                + $this->totalLeapdayOccurrences;
        }

        return $this->previousState->get('epoch');
    }

    private function calculateTotalDaysFromTimespans()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateTotalDaysFromTimespans');
        return $this->calendar->timespans->sum(function($timespan){
            return $timespan->occurrences($this->year-1) * $timespan->length;
        });
    }

    private function calculateTimespanOccurrences()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateTimespanOccurrences');
        if(!$this->previousState->has('timespanOccurrences')) {
            return $this->calendar->timespans
                ->map->occurrences($this->year-1);
        }

        return $this->previousState->get('timespanOccurrences');
    }

    private function calculateTotalLeapdayOccurrences()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateTotalLeapdayOccurrences');
        return $this->leapDayOccurrences->sum();
    }

    private function calculateLeapdayOccurrences()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateLeapdayOccurrences');
        return $this->calendar->leap_days
            ->map->occurrencesOnMonthBetweenYears($this->epochStartYear, $this->year-1, 0);
    }

    private function calculateNumberTimespans()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateNumberTimespans');
        return $this->calendar->timespans
            ->reject->intercalary
            ->map->occurrences($this->year-1)
            ->sum();
    }

    private function calculateTotalWeekNumber()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateTotalWeekNumber');
        if($this->calendar->overflows_week){
            return intval(floor(($this->epoch - $this->historicalIntercalaryCount) / count($this->calendar->global_week)));
        }

        return $this->calendar->timespans->sum(function($timespan){
            $timespanDays = $timespan->occurrences($this->year-1) * $timespan->length;
            $weekLength = count($timespan->week ?? $this->calendar->global_week);
            return abs(ceil($timespanDays/$weekLength));
        });
    }

    private function calculateHistoricalIntercalaryCount()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateHistoricalIntercalaryCount');
        $leapDayIntercalaryDays = $this->calendar->leap_days
            ->filter->intercalary
            ->sum->occurrencesOnMonthBetweenYears($this->epochStartYear, $this->year-1, 0);

        $timespanIntercalaryDays = $this->calendar->timespans
            ->filter->intercalary
            ->sum(function($timespan){
                return $timespan->occurrences($this->year-1) * $timespan->length;
            });

        return $leapDayIntercalaryDays + $timespanIntercalaryDays;
    }

    private function calculateTimespanCounts()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateTimespanCounts');
        return $this->calendar->timespans
            ->map->occurrences($this->year-1);
    }

    private function calculateWeekday()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateWeekday');
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

    private function calculateEpochStartYear()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateEpochStartYear');
        return $this->calendar->setting('year_zero_exists')
            ? 0
            : 1;
    }

    private function staticData($key, $default = null)
    {
//        Log::info('ENTERING: ' . self::class . '::staticData');
        return Arr::get($this->calendar->static_data, $key, $default);
    }
}
