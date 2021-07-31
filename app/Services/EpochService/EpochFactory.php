<?php


namespace App\Services\EpochService;


use App\Calendar;
use App\Collections\EpochsCollection;
use App\Services\CalendarService\Era;
use App\Services\EpochService\Processor\InitialStateWithEras;
use App\Services\EpochService\Processor\State;

class EpochFactory
{
    /**
     * @var Calendar
     */
    private Calendar $calendar;
    /**
     * @var EpochsCollection
     */
    private EpochsCollection $epochs;

    /**
     * Create an EpochFactory for a specific calendar
     *
     * @param Calendar $calendar
     * @return $this
     */
    public function forCalendar(Calendar $calendar): EpochFactory
    {
        $this->calendar = $calendar->replicate();
        $this->epochs = new EpochsCollection();

        return $this;
    }

    /**
     * Generates and returns the epochs for the entire year of a calendar's current date
     *
     * @param Calendar $calendar
     * @return EpochsCollection
     */
    public function forCalendarYear(Calendar $calendar): EpochsCollection
    {
        $this->forCalendar($calendar)
            ->processYear();

        return $this->epochs->whereYear($calendar->year);
    }

    /**
     * Generates and returns the epochs for the current month of a calendar's set date
     *
     * @param Calendar $calendar
     * @return EpochsCollection
     */
    public function forCalendarMonth(Calendar $calendar): EpochsCollection
    {
        return $this->forCalendarYear($calendar)
            ->whereMonthIndexOfYear($calendar->month_index);
    }

    public function forCalendarDay(Calendar $calendar): Epoch
    {
        return $this->forCalendarYear($calendar)
            ->getByDate($calendar->year, $calendar->month_index, $calendar->day);
    }

    /**
     * Generates and returns the epoch for a given date
     *
     * @param $year
     * @param $month
     * @param $day
     * @return Epoch
     */
    public function forDate($year, $month, $day): Epoch
    {
//        logger()->debug("Getting for date: " . date_slug($year, $month, $day));
        if($this->needsDate($year, $month, $day)) {
//            logger()->debug("DOES need date generated");
            $epochs = $this->generateForDate($year, $month, $day);
//            logger()->debug("Generated " . $epochs->count() . " epochs:");
//            logger()->debug($epochs->map->slug);

            $this->rememberEpochs($epochs);
//            logger()->debug("Remembered");
        }

        return $this->getByDate($year, $month, $day);
    }

    /**
     * Generates and returns the epoch for the date of an era change, without taking any *other* eras into account
     *
     * @param Era $era
     * @return mixed
     */
    public function forEra(Era $era)
    {
        $calendar = $this->calendar->replicate()
            ->setDate($era->year)
            ->startOfYear();

        return $this->processor($calendar, false)
            ->processUntilDate($era->year, $era->month, $era->day+1)
            ->last();
    }

    public function forEpoch($epochNumber): Epoch
    {
        $epochsByNumber = $this->epochs->keyBy('epoch');

        if($epochsByNumber->has($epochNumber)) {
            return $epochsByNumber->get($epochNumber);
        }

        return EpochCalculator::forCalendar($this->calendar->replicate())
            ->calculate($epochNumber);
    }

    public function incrementDay(Calendar $calendar, Epoch $epoch = null): Epoch
    {
        return $this->incrementDays(1, $calendar, $epoch);
    }

    public function incrementDays($days, Calendar $calendar, Epoch $epoch = null): Epoch
    {
        $epoch = $epoch ?? $calendar->epoch;

        return $this->forEpoch($epoch->epoch + $days);
    }

    public function incrementMonths($months, Calendar $calendar, Epoch $epoch = null): Epoch
    {
        $target = $this->calendar->month_index + $months;

        if($target >= 0 && $this->calendar->months->has($target)) {
            $month = $this->calendar->months->get($target);

            $targetDay = min($month->daysInYear->count(), $this->calendar->day);

            return $this->forDate($this->calendar->year, $target, $targetDay);
        }

        // Basically the same approach as days but with a different metric
    }

    public function incrementYears($years, Calendar $calendar, Epoch $epoch = null): Epoch
    {
        
    }

    /**
     * Gets a list of all the date slugs registered in our global listing
     *
     * @return EpochsCollection
     */
    public function dateList(): EpochsCollection
    {
        return $this->epochs->keys();
    }

    /**
     * Processes an entire year
     *
     * @return $this
     */
    private function processYear(): EpochFactory
    {
        return $this->rememberEpochs($this->processor()->processYear());
    }

    /**
     * Remembers the given epochs
     *
     * @param EpochsCollection $epochs
     * @return $this
     */
    private function rememberEpochs(EpochsCollection $epochs): EpochFactory
    {
        $this->epochs = $this->epochs->merge($epochs);

        return $this;
    }

    /**
     * Check whether the factory needs a given date
     *
     * @param $year
     * @param $month
     * @param $day
     * @return bool
     */
    private function needsDate($year, $month, $day): bool
    {
        return !$this->hasDate($year, $month, $day);
    }

    /**
     * Check whether the factory has a given date
     *
     * @param $year
     * @param $month
     * @param $day
     * @return bool
     */
    private function hasDate($year, $month, $day): bool
    {
        return $this->epochs->hasDate($year, $month, $day);
    }

    /**
     * Retrieve a specific epoch from the epochs collection
     *
     * @param $year
     * @param $month
     * @param $day
     * @return Epoch
     */
    private function getByDate($year, $month, $day): Epoch
    {
        return $this->epochs->getByDate($year, $month, $day);
    }

    /**
     * Generates epochs for a calendar year, up to a specific date
     *
     * @param $year
     * @param $month
     * @param $day
     * @return EpochsCollection
     */
    private function generateForDate($year, $month, $day): EpochsCollection
    {
        $calendar = $this->calendar
            ->replicate()
            ->setDate($year, $month, $day);

        return $this->processor($calendar)
            ->processUntilDate($year, $month, $day);
    }

    /**
     * Create a processor, specifying a calendar to create it for and whether to take eras into account.
     *
     * @param null $calendar
     * @param bool $withEras
     * @return Processor
     */
    private function processor($calendar = null, $withEras = true): Processor
    {
        $calendar = $calendar ?? $this->calendar->replicate()->startOfYear();
        $state = new State($calendar);

        if(!$withEras) {
            $state->disableEras();
        }

        $state->initialize();

        return new Processor($calendar, $state);
    }
}
