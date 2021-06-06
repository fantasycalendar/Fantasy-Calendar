<?php


namespace App\Services\EpochService\Processor;


use App\Calendar;
use App\Services\CalendarService\Month;
use App\Services\EpochService\Traits\CalculatesAndCachesProperties;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
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

    /**
     * @return void
     */
    public function advance(): void
    {
        $this->flushCache();
        $this->day++;
        $this->epoch++;
        $this->incrementMonth();
        $this->incrementHistoricalIntercalaryCount();
    }

    private function incrementMonth()
    {
        // Compare current day to the previous day's month length
        if($this->day > $this->currentMonth()->daysInYear->count()) {

            $this->day = 1;
            $this->month++;

            if($this->month == $this->months->count()){
                $this->month = 0;
                $this->year++;
                $this->previousState->forget('months');
                $this->previousState->forget('totalYearWeekNumber');
            }

            $this->monthWeekNumber = 0;
            $this->previousState->forget('totalMonthWeekNumber');
            $this->incrementWeek(!$this->calendar->overflows_week);

            if($this->calendar->overflows_week){
                $this->incrementWeekday();
            }

            $this->timespanCounts[$this->monthIndex] = $this->timespanCounts->get($this->monthIndex) + 1;

            $this->numberTimespans++;

            return;
        }

        $this->incrementWeekday();
    }

    private function incrementWeekday()
    {
        if(!$this->isIntercalary()){
            $this->weekday++;
            $this->incrementWeek();
        }
    }

    private function incrementHistoricalIntercalaryCount()
    {
        if($this->isIntercalary()){
            $this->historicalIntercalaryCount++;
        }
    }

    private function incrementWeek($force = false)
    {
        if(
            ($this->weekday >= $this->weekDayCount() || $force)
            && !$this->isIntercalary()
        ){
            $this->weekday = 0;
            $this->totalWeekNumber++;
            $this->monthWeekNumber++;
            $this->yearWeekNumber++;
        }
    }

    /**
     * Compile our data into an array
     *
     * @return array
     */
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
            'weekday' => $this->weekday,
            'monthWeekNumber' => $this->monthWeekNumber,
            'inverseMonthWeekNumber' => $this->totalMonthWeekNumber - ($this->monthWeekNumber - 1),
            'yearWeekNumber' => $this->yearWeekNumber,
            'inverseYearWeekNumber' => $this->totalYearWeekNumber - ($this->yearWeekNumber - 1),
            'isIntercalary' => $this->isIntercalary()
        ];
    }

    /**
     * Month index in the **displayed** year, zero-indexed
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateMonth()
    {
        if(!$this->previousState->has('month')) {
            return 0;
        }
        return $this->previousState->get('month');
    }

    private function weekdayCount()
    {
        return ($this->calendar->overflows_week)
            ? count($this->calendar->global_week)
            : count($this->currentMonth()->weekdays);
    }

    /**
     * Getter for $this->months
     * @see CalculatesAndCachesProperties
     *
     * @return Collection
     */
    private function calculateMonths()
    {
        if(!$this->previousState->has('months')){
            return $this->calendar->months;
        }
        return $this->previousState->get('months');
    }

    /**
     * Current month object in the **displayed** year
     * @see CalculatesAndCachesProperties
     *
     * @return Month
     */
    private function currentMonth()
    {
        return $this->months->get($this->month);
    }

    /**
     * Month index of the current month
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateMonthIndex()
    {
        return $this->currentMonth()->id;
    }

    /**
     * Whether the current day is intercalary
     * @see CalculatesAndCachesProperties
     *
     * @return bool
     */
    private function isIntercalary()
    {
        return $this->currentMonth()->daysInYear[$this->day-1]->intercalary;
    }

    /**
     * Getter for $this->monthWeekNumber
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateYearWeekNumber()
    {
        if(!$this->previousState->has('yearWeekNumber')){
            return 1;
        }
        return $this->previousState->get('yearWeekNumber');
    }

    /**
     * Getter for $this->totalYearWeekNumber
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateTotalYearWeekNumber()
    {
        if(!$this->previousState->has('totalYearWeekNumber')){

            if($this->calendar->overflows_week){

                $totalDaysInYear = $this->months->sum(function($month) {
                    return $month->daysInYear->reject->intercalary->count();
                });

                return (int) abs(ceil(($totalDaysInYear + $this->weekday) / count($this->calendar->global_week)));

            }

            return $this->months->sum(function($month){

                $monthDays = $month->daysInYear->reject->intercalary->count();

                $monthIntercalaries = $month->daysInYear->filter->intercalary->count();

                $totalWeekdaysBeforeToday = ($monthDays - $monthIntercalaries + $this->weekday);

                $weeks = abs(ceil($totalWeekdaysBeforeToday / $month->weekdays->count()));

                return (int) $weeks;

            });

        }
        return $this->previousState->get('totalYearWeekNumber');
    }

    /**
     * Getter for $this->monthWeekNumber
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateMonthWeekNumber()
    {
        if(!$this->previousState->has('monthWeekNumber')){
            return 1;
        }
        return $this->previousState->get('monthWeekNumber');
    }

    /**
     * Getter for $this->totalMonthWeekNumber
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateTotalMonthWeekNumber()
    {
        if(!$this->previousState->has('totalMonthWeekNumber')){

            $monthDays = $this->currentMonth()->daysInYear->filter(function($day){
                return !$day;
            })->count();

            $monthIntercalaries = $this->currentMonth()->daysInYear->reject(function($day){
                return !$day;
            })->count();

            $totalWeekdaysBeforeToday = ($monthDays - $monthIntercalaries + $this->weekday);

            $weeks = abs(ceil($totalWeekdaysBeforeToday / $this->currentMonth()->weekdays->count()))+1;

            return (int) $weeks;

        }
        return $this->previousState->get('totalMonthWeekNumber');
    }

    /**
     * Getter for $this->moonPhases
     * @see CalculatesAndCachesProperties
     *
     * @return mixed
     */
    private function calculateMoonPhases()
    {
        return $this->calendar->moons
            ->map(function($moon) {
                return $moon->setEpoch($this->epoch)->getPhases();
            });
    }

    /**
     * Getter for $this->epoch
     * @see CalculatesAndCachesProperties
     *
     * @return mixed
     */
    private function calculateEpoch()
    {
        return $this->previousState->get('epoch');
    }

    /**
     * Getter for $this->timespanOccurrences
     * @see CalculatesAndCachesProperties
     *
     * @return mixed
     */
    private function calculateTimespanOccurrences()
    {
        return $this->previousState->get('timespanOccurrences');
    }

    /**
     * Getter for $this->timespanCounts
     * @see CalculatesAndCachesProperties
     *
     * @return mixed
     */
    private function calculateTimespanCounts()
    {
        return $this->previousState->get('timespanCounts');
    }

    /**
     * Getter for $this->numberTimespans
     * @see CalculatesAndCachesProperties
     *
     * @return mixed
     */
    private function calculateNumberTimespans()
    {
        return $this->previousState->get('numberTimespans');
    }

    /**
     * Getter for $this->totalWeekNumber
     * @see CalculatesAndCachesProperties
     *
     * @return mixed
     */
    private function calculateTotalWeekNumber()
    {
        return $this->previousState->get('totalWeekNumber');
    }

    /**
     * Getter for $this->historicalIntercalaryCount
     * @see CalculatesAndCachesProperties
     *
     * @return mixed
     */
    private function calculateHistoricalIntercalaryCount()
    {
        return $this->previousState->get('historicalIntercalaryCount');
    }

    /**
     * Getter for $this->weekday
     * @see CalculatesAndCachesProperties
     *
     * @return mixed
     */
    private function calculateWeekday()
    {
        return $this->previousState->get('weekday');
    }

    private function staticData($key, $default = null)
    {
//        Log::info('ENTERING: ' . self::class . '::staticData');
        return Arr::get($this->calendar->static_data, $key, $default);
    }
}
