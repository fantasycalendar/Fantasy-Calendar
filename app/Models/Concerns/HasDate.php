<?php


namespace App\Models\Concerns;


use App\Models\Calendar;
use App\Exceptions\InvalidDateException;
use App\Facades\Epoch as EpochFactory;
use App\Services\EpochService\Epoch;
use App\Services\EpochService\EpochCalculator;
use Illuminate\Support\Str;


/**
 * Trait HasDate
 * @package App\Models\Concerns
 * @method Calendar addMinute()
 * @method Calendar subMinute()
 * @method Calendar addHour()
 * @method Calendar subHour()
 * @method Calendar addDay()
 * @method Calendar subDay()
 * @method Calendar addMonth()
 * @method Calendar subMonth()
 * @method Calendar addYear()
 * @method Calendar subYear()
 */
trait HasDate
{
    /**
     * Add a set of minutes to the current time of this calendar
     *
     * @param $minutes
     * @return $this
     */
    public function addMinutes(int $minutes = 1): Calendar
    {
        if(!$this->clock_enabled) return $this;

        $hoursAdded = ($this->dynamic('minute') + $minutes) / $this->clock['minutes'];
        $daysAdded = ($this->dynamic('hour') + $hoursAdded) / $this->clock['hours'];

        $currentHour = fmod($daysAdded, 1) * $this->clock['hours'];

        if($currentHour < 0){
            $currentHour += $this->clock['hours'];
        }

        $currentMinute = (int) round(fmod($currentHour, 1) * $this->clock['minutes']);
        $currentHour = (int) floor($currentHour);

        if($currentMinute === $this->clock['minutes']) {
            $currentHour++;
            $currentMinute = 0;

            if($currentHour === $this->clock['hours']) {
                $daysAdded++;
                $currentHour = 0;
            }
        }

        $this->dynamic([
            'hour' => $currentHour,
            'minute' => $currentMinute
        ]);

        return $this->addDays(floor($daysAdded));
    }
    /**
     * Add a set of hours to the current time of this calendar
     *
     * @param $hours
     * @return $this
     */
    public function addHours(int $hours = 1): Calendar
    {
        if(!$this->clock_enabled) return $this;

        $minutes = $hours * $this->clock['minutes'];

        return $this->addMinutes($minutes);
    }

    /**
     * Add a set number of days to the current date of this calendar
     *
     * @param int $days
     * @return Calendar
     */
    public function addDays(int $days = 1): Calendar
    {
        return ($days === 0)
            ? $this
            : $this->setDateFromEpoch(EpochFactory::incrementDays($days, $this));
    }

    /**
     * Add a set number of months to the current date of this calendar
     *
     * @param int $months
     * @return Calendar
     */
    public function addMonths(int $months = 1): Calendar
    {
        $targetMonth = $this->month_index + $months;
        if($this->months->has($targetMonth)){
            return $this->setDate($this->year, $this->months->get($targetMonth)->id);
        }

        $targetMonthCount = $this->epoch->numberTimespans + $months;
        $guessYear = (int) floor( $targetMonthCount / $this->average_months_count) + $this->setting('year_zero_exists') + 1;
        $foundTargetMonthCount = false;

        do {
            $guessYearMonthCounts = EpochFactory::forCalendarYear($this->replicate()->setDate($guessYear))
                ->keyBy('numberTimespans')
                ->map->monthId
                ->unique();

            if(!$guessYearMonthCounts->has($targetMonthCount)) {
                $lower = $guessYearMonthCounts->keys()->min();

                if($targetMonthCount < $lower) {
                    $guessYear--;
                    continue;
                }

                $guessYear++;
                continue;
            }

            $foundTargetMonthCount = true;
        } while($foundTargetMonthCount == false);

        return $this->setDate($guessYear, $guessYearMonthCounts->get($targetMonthCount));
    }

    /**
     * Add a set number of years to the current date of this calendar
     *
     * @param int $years
     * @return Calendar
     */
    public function addYears(int $years = 1): Calendar
    {
        return $this->setDate($this->year + $years);
    }

    /**
     * Set this calendar to the start of the calendar year
     *
     * @return Calendar
     */
    public function startOfYear(): Calendar
    {
        return $this->setDate($this->year, $this->months->keys()->first(), 1);
    }

    /**
     * Set this calendar to the end of the calendar year
     *
     * @return Calendar
     */
    public function endOfYear(): Calendar
    {
        return $this->setDateFromEpoch(EpochFactory::forCalendarYear($this)->last());
    }

    /**
     * Set the full range of the date on this calendar
     *
     * @param $targetYear
     * @param null $timespanId
     * @param null $day
     * @return $this
     */
    public function setDate(int $targetYear, $timespanId = null, $day = null, $hour = null, $minute = null): Calendar
    {
        $targetTimespan = $timespanId ?? $this->dynamic('timespan');
        $targetDay = $day ?? $this->dynamic('day');
        $targetHour = $hour ?? $this->dynamic('hour');
        $targetMinute = $minute ?? $this->dynamic('minute');

        $this->dynamic('year', $this->findNearestValidYear($targetYear));
        $this->dynamic('timespan', $this->findNearestValidMonth($targetTimespan));
        $this->dynamic('day', $this->findNearestValidDay($targetDay));
        $this->dynamic('hour', $targetHour);
        $this->dynamic('minute', $targetMinute);

        return $this;
    }

    private function findNearestValidYear($targetYear)
    {
        if($this->year === $targetYear) return $this->year;

        $searchDirection = $targetYear < $this->year
            ? -1
            : 1;

        while(!$this->yearIsValid($targetYear)) {
            $targetYear += $searchDirection;
        }

        return $targetYear;
    }

    private function findNearestValidMonth($monthId)
    {
        if($this->months->hasId($monthId)) return $monthId;

        $foundValidMonth = false;
        $targetMonthId = $this->month_id;
        $monthDirection = $targetMonthId === 0
            ? 1
            : -1;

        do {
            $targetMonthId += $monthDirection;

            if(($targetMonthId - 1) > $this->timespans->count()) throw new InvalidDateException('No valid months found?! Um. You should never get here. Go bug Axel or Wasp if it happens.');

            if($targetMonthId < 0) {
                $monthDirection = 1;
                $targetMonthId = $this->month_id + 1;
            }

            if(!$this->months->hasId($targetMonthId)) {
                continue;
            }

            $foundValidMonth = true;
        } while($foundValidMonth === false);

        return $targetMonthId;
    }

    private function findNearestValidDay($day)
    {
        return clamp($day, 1, $this->month->daysInYear->count());
    }

    /**
     * Sets the calendar date from an epoch object
     *
     * @param Epoch $epoch
     * @return Calendar
     */
    public function setDateFromEpoch(Epoch $epoch): Calendar
    {
        return $this->setDate($epoch->year, $epoch->monthId, $epoch->day);
    }

    public function __call($method, $arguments)
    {
        if(Str::startsWith($method, ['sub', 'add'])) {
            $number = $arguments[0] ?? 1;
            if(Str::startsWith($method, 'sub')) {
                $number *= -1;
            }

            $dateMethod = Str::replace('sub', 'add', Str::plural($method));

            if(method_exists($this, $dateMethod)) {
                return $this->$dateMethod($number);
            }
        }

        return parent::__call($method, $arguments);
    }
}
