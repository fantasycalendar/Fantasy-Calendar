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
        $this->calendar = $calendar;
        $this->year = $calendar->year;
        $this->initialize($withEras);
    }

    private function initialize($withEras)
    {
        if($withEras) {
            $this->statecache = InitialStateWithEras::generateFor($this->calendar)->collect();
        } else {
            $this->statecache = InitialState::generateFor($this->calendar)->collect();
        }

        $this->previousState = collect();
    }

    /**
     * Increments the day of the state
     * @return void
     */
    public function incrementDay(): void
    {
        $this->flushCache();
        $this->day++;
        $this->epoch++;
        $this->incrementMonth();
        $this->incrementHistoricalIntercalaryCount();
    }

    /**
     * Increments the current month, if needed
     * @return void
     */
    private function incrementMonth(): void
    {
        // Compare current day to the previous day's month length
        if($this->day > $this->currentMonth()->daysInYear->count()) {

            $this->day = 1;
            $this->month++;

            if($this->month == $this->months->count()){
                $this->month = 0;
                $this->year++;
                $this->previousState->forget('months');
                $this->previousState->forget('totalWeeksInYear');
            }

            $this->weeksSinceMonthStart = 0;
            $this->previousState->forget('totalWeeksInMonth');
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

    /**
     * Increments the current weekdayIndex
     * @return void
     */
    private function incrementWeekday(): void
    {
        if(!$this->isIntercalary()){
            $this->weekdayIndex++;
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
            ($this->weekdayIndex >= $this->weekDayCount() || $force)
            && !$this->isIntercalary()
        ){
            $this->weekdayIndex = 0;
            $this->weeksSinceMonthStart++;
            $this->weeksSinceYearStart++;
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
            'monthName' => $this->currentMonth()->name,
            'timespanCounts' => $this->timespanCounts,
            'historicalIntercalaryCount' => $this->historicalIntercalaryCount,
            'numberTimespans' => $this->numberTimespans,
            'monthIndex' => $this->monthIndex,
            'weekdayIndex' => $this->weekdayIndex,
            'weekdayName' => $this->weekdays()->get($this->weekdayIndex),
            'weeksSinceMonthStart' => $this->weeksSinceMonthStart,
            'weeksTilMonthEnd' => $this->totalWeeksInMonth - ($this->weeksSinceMonthStart - 1),
            'weeksSinceYearStart' => $this->weeksSinceYearStart,
            'weeksTilYearEnd' => $this->totalWeeksInYear - ($this->weeksSinceYearStart - 1),
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

    /**
     * The weekdays in the current month
     * @return Collection
     */
    private function weekdays(): Collection
    {
        return ($this->calendar->overflows_week)
            ? $this->calendar->global_week
            : $this->currentMonth()->weekdays;
    }

    /**
     * The number of weekdays in the current month
     * @return int
     */
    private function weekdayCount(): int
    {
        return count($this->weekdays());
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
     * Getter for $this->weeksSinceMonthStart
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateWeeksSinceYearStart()
    {
        if(!$this->previousState->has('weeksSinceYearStart')){
            return 1;
        }
        return $this->previousState->get('weeksSinceYearStart');
    }

    /**
     * Getter for $this->totalWeeksInYear
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateTotalWeeksInYear()
    {
        if(!$this->previousState->has('totalWeeksInYear')){

            if($this->calendar->overflows_week){

                $totalDaysInYear = $this->months->sum(function($month) {
                    return $month->daysInYear->reject->intercalary->count();
                });

                return (int) abs(ceil(($totalDaysInYear + $this->weekdayIndex) / count($this->calendar->global_week)));

            }

            return $this->months->sum(function($month){

                $monthDays = $month->daysInYear->reject->intercalary->count();

                $weeks = abs(ceil($monthDays / $month->weekdays->count()));

                return (int) $weeks;

            });

        }
        return $this->previousState->get('totalWeeksInYear');
    }

    /**
     * Getter for $this->weeksSinceMonthStart
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateWeeksSinceMonthStart()
    {
        if(!$this->previousState->has('weeksSinceMonthStart')){
            return 1;
        }
        return $this->previousState->get('weeksSinceMonthStart');
    }

    /**
     * Getter for $this->totalWeeksInMonth
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateTotalWeeksInMonth()
    {
        if(!$this->previousState->has('totalWeeksInMonth')){

            $monthDays = $this->currentMonth()->daysInYear->reject->intercalary->count();

            $totalWeekdaysBeforeToday = ($monthDays + $this->weekdayIndex);

            $weeks = abs(ceil($totalWeekdaysBeforeToday / $this->currentMonth()->weekdays->count()));

            return (int) $weeks;

        }
        return $this->previousState->get('totalWeeksInMonth');
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
     * Getter for $this->weekdayIndex
     * @see CalculatesAndCachesProperties
     *
     * @return mixed
     */
    private function calculateWeekdayIndex()
    {
        return $this->previousState->get('weekdayIndex');
    }

    private function staticData($key, $default = null)
    {
//        Log::info('ENTERING: ' . self::class . '::staticData');
        return Arr::get($this->calendar->static_data, $key, $default);
    }
}
