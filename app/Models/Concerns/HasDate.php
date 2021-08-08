<?php


namespace App\Models\Concerns;


use App\Calendar;
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

        $dynamic_data = $this->dynamic_data;

        $currentHour = $dynamic_data['hour'];
        $currentMinute = $dynamic_data['minute'];

        $extraHours = ($currentMinute + $minutes) / $this->clock['minutes'];
        $extraDays = ($currentHour + $extraHours) / $this->clock['hours'];

        $currentHour = round(fmod($extraDays, 1) * $this->clock['hours'], 4);
        $currentMinute = floor(fmod($currentHour, 1) * $this->clock['minutes']);

        $dynamic_data['hour'] = floor($currentHour);
        $dynamic_data['minute'] = $currentMinute;

        $this->dynamic_data = $dynamic_data;

        $extraDays = floor($extraDays);
        if($extraDays != 0){
            $this->addDays($extraDays);
        }

        return $this;
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
        return $this->setDateFromEpoch(EpochFactory::incrementDays($days, $this));
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
     * @param $year
     * @param null $timespanId
     * @param null $day
     * @return $this
     */
    public function setDate($year, $timespanId = null, $day = null, $hour = null, $minute = null): Calendar
    {
        $dynamic_data = $this->dynamic_data;

        $targetYear = $year ?? $dynamic_data['year'];
        $targetTimespan = $timespanId ?? $dynamic_data['timespan'];
        $targetDay = $day ?? $dynamic_data['day'];
        $targetHour = $hour ?? $dynamic_data['hour'];
        $targetMinute = $minute ?? $dynamic_data['minute'];

        $dynamic_data['year'] = $this->findNearestValidYear($targetYear);
        $this->dynamic_data = $dynamic_data;

        $dynamic_data['timespan'] = $this->findNearestValidMonth($targetTimespan);
        $this->dynamic_data = $dynamic_data;

        $dynamic_data['day'] = $this->findNearestValidDay($targetDay);
        $this->dynamic_data = $dynamic_data;

        $dynamic_data['hour'] = $targetHour;
        $this->dynamic_data = $dynamic_data;

        $dynamic_data['minute'] = $targetMinute;
        $this->dynamic_data = $dynamic_data;

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
        return min($this->month->daysInYear->count(), $day);
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

    public function setDateFromParentCalendar(Calendar $parentCalendar, int $targetEpoch): Calendar
    {

        $targetEpoch = $targetEpoch - $this->parent_offset;

        $hour = $parentCalendar->dynamic_data['hour'];
        $minute = $parentCalendar->dynamic_data['minute'];

        if($parentCalendar->clock_enabled && $this->clock_enabled &&
            (
                $parentCalendar->clock['hours'] !== $this->clock['hours'] || $parentCalendar->clock['minutes'] !== $this->clock['minutes']
            )
        ) {

            $timeScale = $parentCalendar->daily_minutes / $this->daily_minutes;

            $targetEpoch = $targetEpoch * $timeScale;

            $extraHours = fmod($targetEpoch, 1) * $this->clock['hours'];
            $extraMinutes = floor(fmod($extraHours, 1) * $this->clock['minutes']);

            $parentMinuteInDay = $hour * $parentCalendar->clock['minutes'] + $minute;

            $targetHour = $parentMinuteInDay / $this->clock['minutes'];
            $targetMinute = floor(fmod($targetHour, 1) * $this->clock['minutes']);

            $hour = floor($extraHours) + floor($targetHour);
            $minute = $extraMinutes + $targetMinute;

            if($minute >= $this->clock['minutes']){
                $hour++;
                $minute -= $this->clock['minutes'];
            }

            if($hour >= $this->clock['hours']){
                $targetEpoch++;
                $hour -= $this->clock['hours'];
            }

        }

        $epoch = EpochCalculator::forCalendar($this)->calculate($targetEpoch);

        return $this->setDate($epoch->year, $epoch->monthId, $epoch->day, $hour, $minute);

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
