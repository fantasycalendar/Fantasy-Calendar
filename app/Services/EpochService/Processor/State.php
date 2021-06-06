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
    public function __construct($calendar, $withEras = true)
    {
//        Log::info('ENTERING: ' . self::class . '::__construct');
        $this->calendar = $calendar;
        $this->year = $calendar->year;

        Log::info('initing state');
        Log::info($calendar->dynamic_data);

        $this->initialize($withEras);
    }

    private function initialize($withEras)
    {
        //        Log::info('ENTERING: ' . self::class . '::initialize');
        if($withEras) {
            $this->statecache = InitialStateWithEras::generateFor($this->calendar)->collect();
            //        $this->nextYearState = InitialStateWithEras::generateFor($this->calendar->addYear()->startOfYear())->collect();
        } else {
            $this->statecache = InitialState::generateFor($this->calendar)->collect();
            //        $this->nextYearState = InitialStateWithEras::generateFor($this->calendar->addYear()->startOfYear())->collect();
        }

        $this->previousState = collect();
    }

    public function advance()
    {

        $this->day++;
        $this->weekday++;
        $this->epoch++;

        // Compare current day to the previous day's month length
        if($this->day > $this->currentMonth->daysInYear->count()) {

            $this->day = 1;
            $this->month++;

            if(!$this->calendar->overflows_week){
                $this->weekday = 0;
                $this->totalWeekNumber++;
            }

            $this->timespanCounts[$this->monthIndex] = $this->timespanCounts->get($this->monthIndex) + 1;

            $this->numberTimespans++;

            if($this->month+1 >= count($this->months)){
                $this->month = 0;
                $this->year++;
                $this->previousState->forget('months');
            }

        }

        if($this->currentMonth->daysInYear[$this->day-1]){
            $this->historicalIntercalaryCount++;
        }

        if($this->calendar->overflows_week){
            if($this->weekday >= count($this->calendar->global_week)){
                $this->weekday = 0;
                $this->totalWeekNumber++;
            }
        }else{
            if($this->weekday >= count($this->currentMonth->weekdays) ){
                $this->weekday = 0;
                $this->totalWeekNumber++;
            }
        }

        $this->flushCache();
    }

    public function toArray(): array
    {
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
     * Month index in the **displayed** year, zero-indexed
     */
    private function calculateMonth()
    {
        if(!$this->previousState->has('month')) {
            return 0;
        }
        return $this->previousState->get('month');
    }

    /*
     * Current month object in the **displayed** year
     */
    private function calculateCurrentMonth()
    {
        return $this->months->get($this->month);
    }

    /*
     * Month index of the current month
     */
    private function calculateMonthIndex()
    {
        return $this->currentMonth->id;
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
        return $this->previousState->get('epoch');
    }

    private function calculateTimespanOccurrences()
    {
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
        return $this->previousState->get('weekday');
    }

    private function staticData($key, $default = null)
    {
//        Log::info('ENTERING: ' . self::class . '::staticData');
        return Arr::get($this->calendar->static_data, $key, $default);
    }
}
