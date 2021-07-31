<?php


namespace App\Models\Concerns;


use App\Calendar;
use App\Facades\Epoch as EpochFactory;
use App\Services\EpochService\Epoch;
use Illuminate\Support\Arr;
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
        return $this->setDateFromEpoch(EpochFactory::incrementMonths($months, $this));
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
        return $this->setDate($this->year, $this->months->first()->id, 1);
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
    public function setDate($year, $timespanId = null, $day = null): Calendar
    {
        $dynamic_data = $this->dynamic_data;

        $targetYear = $year ?? $dynamic_data['year'];
        $targetTimespan = $timespanId ?? $dynamic_data['timespan'];
        $targetDay = $day ?? $dynamic_data['day'];

        $dynamic_data['year'] = $this->findNearestValidYear($targetYear);
        $this->dynamic_data = $dynamic_data;

        $dynamic_data['timespan'] = $this->findNearestValidMonth($targetTimespan);
        $this->dynamic_data = $dynamic_data;

        $dynamic_data['day'] = $this->findNearestValidDay($targetDay);
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

        dump("Starting with:", $foundValidMonth, $targetMonthId, $monthDirection, $this->months->map->id);

        do {
            $targetMonthId += $monthDirection;
            dump("Checking for month: $targetMonthId");

            if(($targetMonthId - 1) > $this->months->count()) throw new \Exception('Um. What?!');

            if($targetMonthId < 0) {
                $monthDirection = 1;
                $targetMonthId = $this->month_id + 1;
                dump("Got to 0, swapping direction and starting over from $targetMonthId");
            }

            if(!$this->months->hasId($targetMonthId)) {
                continue;
            }

            $foundValidMonth = true;
        } while($foundValidMonth === false);

//        dd($targetMonthId);

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
