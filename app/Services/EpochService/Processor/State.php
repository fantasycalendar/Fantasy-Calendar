<?php


namespace App\Services\EpochService\Processor;


use App\Calendar;
use App\Services\CalendarService\Month;
use App\Services\EpochService\Traits\CalculatesAndCachesProperties;
use Illuminate\Support\Collection;

/**
 * @property int monthIndexOfYear
 * @property int epoch
 * @property int dayOfYear
 * @property int weekdayIndex
 * @property Collection months
 * @property int weeksSinceMonthStart
 * @property Collection timespanCounts
 * @property int monthId
 * @property int numberTimespans
 * @property int historicalIntercalaryCount
 * @property int weeksSinceYearStart
 * @property int totalWeeksInMonth
 * @property int totalWeeksInYear
 */
class State
{
    use CalculatesAndCachesProperties;

    public int $day = 1;
    public int $year;
    protected Calendar $calendar;
    protected Collection $previousState;
    private bool $withEras = true;

    /**
     * State constructor.
     * @param Calendar $calendar
     */
    public function __construct(Calendar $calendar)
    {
        $this->calendar = $calendar;
        $this->year = $calendar->year;
        $this->previousState = collect();
    }

    /**
     * Disables eras on the State instance
     *
     * @return $this
     */
    public function disableEras(): State
    {
        $this->withEras = false;
        $this->previousState->put('months', $this->calendar->months_without_eras);

        return $this;
    }

    /**
     * Initializes state cache and previous state
     */
    public function initialize()
    {
        $this->statecache = $this->buildInitialState();
    }

    /**
     * Builds the correct initial state, with or without eras
     *
     * @return mixed
     */
    public function buildInitialState()
    {
        $initialStateClass = $this->withEras
            ? InitialStateWithEras::class
            : InitialState::class;

        return call_user_func_array([$initialStateClass, 'generateFor'], [$this->calendar->replicate()]);
    }

    /**
     * Increments the day of the state
     * @return void
     */
    public function stepForward(): void
    {
        $this->flushCache();
        $this->incrementDay();
        $this->incrementMonth();
        $this->incrementHistoricalIntercalaryCount();
    }

    /**
     * Compile our data into an array
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'year' => $this->year,
            'eraYear' => $this->eraYear,
            'monthIndexOfYear' => $this->monthIndexOfYear,
            'day' => $this->day,
            'epoch' => $this->epoch,
            'monthId' => $this->monthId,
            'dayOfYear' => $this->dayOfYear,
            'month' => $this->currentMonth(),
            'timespanCounts' => $this->timespanCounts,
            'historicalIntercalaryCount' => $this->historicalIntercalaryCount,
            'numberTimespans' => $this->numberTimespans,
            'weekdayIndex' => $this->weekdayIndex,
            'weekdayName' => $this->weekdays()->get($this->weekdayIndex),
            'weeksSinceMonthStart' => $this->weeksSinceMonthStart,
            'weeksTilMonthEnd' => $this->totalWeeksInMonth - ($this->weeksSinceMonthStart - 1),
            'weeksSinceYearStart' => $this->weeksSinceYearStart,
            'weeksTilYearEnd' => $this->totalWeeksInYear - ($this->weeksSinceYearStart - 1),
            'isIntercalary' => $this->isIntercalary()
        ];
    }

    /*
     *-------------------------------------------------------------
     * Methods for Incrementing Values
     *-------------------------------------------------------------
     */

    /**
     * Update values that should increase to move one day forward
     */
    private function incrementDay(): void
    {
        $this->day++;
        $this->epoch++;
        $this->dayOfYear++;
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

    /**
     * @param false $force Whether or not to force the week to move forward even when it (technically) oughtn't
     */
    private function incrementWeek($force = false): void
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
     * Increments the current month, if needed
     * @return void
     */
    private function incrementMonth(): void
    {
        if($this->day < $this->currentMonth()->daysInYear->count()){
            $this->incrementWeekday();
            return;
        }

        $this->timespanCounts[$this->monthId] = $this->timespanCounts->get($this->monthId) + 1;
        $this->numberTimespans++;

        $this->day = 1;
        $this->monthIndexOfYear++;
        $this->monthId++;


        if($this->monthIndexOfYear == $this->months->count()){
            $this->incrementYear();
        }

        $this->weeksSinceMonthStart = 0;
        $this->previousState->forget('totalWeeksInMonth');
        $this->incrementWeek(!$this->calendar->overflows_week);

        if($this->calendar->overflows_week){
            $this->incrementWeekday();
        }
    }

    /**
     * @return void
     */
    private function incrementHistoricalIntercalaryCount(): void
    {
        if($this->isIntercalary()){
            $this->historicalIntercalaryCount++;
        }
    }

    /**
     * Increments the current year
     * @return void
     */
    private function incrementYear(): void
    {
        $this->monthIndexOfYear = 0;
        $this->year++;
        $this->previousState->forget('months');
        $this->previousState->forget('totalWeeksInYear');
        $this->previousState->forget('dayOfYear');
    }

    /*
     * -------------------------------------------------------------
     * Methods for Fetching Values
     *-------------------------------------------------------------
     */

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
     * Current month object in the **displayed** year
     * @see CalculatesAndCachesProperties
     *
     * @return Month
     */
    private function currentMonth(): Month
    {
        return $this->months->get($this->monthIndexOfYear);
    }

    /**
     * Whether the current day is intercalary
     * @see CalculatesAndCachesProperties
     *
     * @return bool
     */
    private function isIntercalary(): bool
    {
        return $this->currentMonth()->daysInYear[$this->day-1]->intercalary;
    }

    /*
     * -------------------------------------------------------------
     * Methods for Calculating Values
     *-------------------------------------------------------------
     */

    /**
     * Month index in the **displayed** year, zero-indexed
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateMonthIndexOfYear(): int
    {
        return $this->previousState->get('monthIndexOfYear', 0);
    }

    /**
     * Getter for $this->months
     * @see CalculatesAndCachesProperties
     *
     * @return Collection
     */
    private function calculateMonths(): Collection
    {
        // We're not using the 'default' argument on ->get() here, because $this->calendar->months
        // regenerates the full collection every time, and we want to avoid doing that for performance reasons.
        return ($this->previousState->has('months'))
            ? $this->previousState->get('months')
            : $this->calendar->months;
    }

    /**
     * Timespan id of the current month
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateMonthId(): int
    {
        return $this->currentMonth()->id;
    }

    /**
     * Getter for $this->weeksSinceMonthStart
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateWeeksSinceYearStart(): int
    {
        return $this->previousState->get('weeksSinceYearStart', 1);
    }

    /**
     * Getter for $this->totalWeeksInYear
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateTotalWeeksInYear(): int
    {
        if($this->previousState->has('totalWeeksInYear')){
            return $this->previousState->get('totalWeeksInYear');
        }

        if($this->calendar->overflows_week){
            $totalDaysInYear = $this->months->sum->countNormalDays();

            return (int) abs(ceil(($totalDaysInYear + $this->weekdayIndex) / $this->calendar->global_week->count()));
        }

        return $this->months->sum->countWeeksInYear();
    }

    /**
     * Getter for $this->weeksSinceMonthStart
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateWeeksSinceMonthStart(): int
    {
        return $this->previousState->get('weeksSinceMonthStart', 1);
    }

    /**
     * Getter for $this->totalWeeksInMonth
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateTotalWeeksInMonth(): int
    {
        if($this->previousState->has('totalWeeksInMonth')){
            return $this->previousState->get('totalWeeksInMonth');
        }

        $totalWeekdaysBeforeToday = ($this->currentMonth()->countNormalDays() + $this->weekdayIndex);

        return (int) abs(ceil($totalWeekdaysBeforeToday / $this->currentMonth()->weekdays->count()));;
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
     * Getter for $this->dayOfYear
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateDayOfYear(): int
    {
        return $this->previousState->get('dayOfYear', 1);
    }

    /**
     * Getter for $this->epoch
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateEpoch(): int
    {
        return $this->previousState->get('epoch');
    }

    /**
     * Getter for $this->timespanCounts
     * @see CalculatesAndCachesProperties
     *
     * @return Collection
     */
    private function calculateTimespanCounts(): Collection
    {
        return $this->previousState->get('timespanCounts');
    }

    /**
     * Getter for $this->numberTimespans
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateNumberTimespans(): int
    {
        return $this->previousState->get('numberTimespans');
    }

    /**
     * Getter for $this->historicalIntercalaryCount
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateHistoricalIntercalaryCount(): int
    {
        return $this->previousState->get('historicalIntercalaryCount');
    }

    /**
     * Getter for $this->weekdayIndex
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateWeekdayIndex(): int
    {
        return $this->previousState->get('weekdayIndex');
    }

    /**
     * Getter for $this->eraYear
     * @see CalculatesAndCachesProperties
     *
     * @return int
     */
    private function calculateEraYear(): int
    {
        return $this->previousState->get('eraYear');
    }
}
