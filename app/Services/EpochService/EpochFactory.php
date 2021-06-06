<?php


namespace App\Services\EpochService;


use App\Calendar;
use App\Collections\EpochsCollection;
use App\Services\CalendarService\Era;
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
        $this->calendar = $calendar->replicate()->startOfYear();
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
            ->whereMonthId($calendar->month_id);
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
        if($this->needsDate($year, $month, $day)) {
            $epochs = $this->generateForDate($year, $month, $day);

            $this->rememberEpochs($epochs);
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
        return $this->generateForDate($era->year, $era->month, $era->day+1)->last();
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
        $calendar = $calendar ?? $this->calendar;
        $state = new State($calendar);

        if(!$withEras) {
            $state->disableEras();
        }

        $state->initialize();

        return new Processor($calendar, $state);
    }
}
