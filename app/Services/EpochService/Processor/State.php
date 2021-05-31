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
    public int $year;
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
        $this->year = $calendar->year;

        Log::info('initing state');
        Log::info($calendar->dynamic_data);

        $this->initialize();
    }

    private function initialize()
    {
//        Log::info('ENTERING: ' . self::class . '::initialize');
        $this->statecache = InitialStateWithEras::generateFor($this->calendar)->collect();
//        $this->nextYearState = InitialStateWithEras::generateFor($this->calendar->addYear()->startOfYear())->collect();
        $this->previousState = collect();
    }

    public function advance()
    {

        //        Log::info('ENTERING: ' . self::class . '::advance');
        $this->day++;
        $this->epoch++;


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
            'month' => $this->month,
            'year' => $this->year,
            'day' => $this->day,
            'epoch' => $this->epoch,
            'timespanCounts' => $this->timespanCounts,
            'historicalIntercalaryCount' => $this->historicalIntercalaryCount,
            'numberTimespans' => $this->numberTimespans,
            'totalWeekNumber' => $this->totalWeekNumber,
            'monthIndex' => $this->monthIndex,
            'weekday' => $this->weekday
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

        if($this->day > $this->months->get($this->previousState->get('month'))->daysInYear) {

            $this->day = 1;
            $this->previousState->forget('monthLength');
            $this->previousState->forget('monthIndex');

            if($this->previousState->get('month')+1 >= count($this->months)){
                $this->year++;
                $this->previousState->forget('months');
                return 0;
            }

            return $this->previousState->get('month')+1;

        }

        return $this->previousState->get('month');
    }

    private function calculateMonthIndex()
    {
        if(!$this->previousState->has('monthIndex')) {
            return $this->months->get($this->month)->id;
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

    private function calculateEpoch()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateEpoch');

        if(!$this->previousState->has('epoch')){
            return $this->totalDaysFromTimespans
                + $this->totalLeapdayOccurrences;
        }

        return $this->previousState->get('epoch');
    }

    private function calculateTimespanOccurrences()
    {
//        Log::info('ENTERING: ' . self::class . '::calculateTimespanOccurrences');
        if(!$this->previousState->has('timespanOccurrences')) {
            return $this->calendar->timespans
                ->map->occurrences($this->year);
        }

        return $this->previousState->get('timespanOccurrences');
    }

    private function calculateNumberTimespans()
    {
        return $this->previousState->get('numberTimespans');
    }

    private function calculateTotalWeekNumber()
    {
        return $this->previousState->get('totalWeekNumber');
    }

    private function calculateHistoricalIntercalaryCount()
    {
        return $this->previousState->get('historicalIntercalaryCount');
    }

    private function calculateTimespanCounts()
    {
        return $this->previousState->get('timespanCounts');
    }

    private function calculateWeekday()
    {
        // To-do A&A: Cannot get the weekdays from a month, since the months are technically still timespans and not months.
        return $this->previousState->get('weekday')+1;
    }

    private function staticData($key, $default = null)
    {
//        Log::info('ENTERING: ' . self::class . '::staticData');
        return Arr::get($this->calendar->static_data, $key, $default);
    }
}
