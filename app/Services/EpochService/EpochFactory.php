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
            ->whereMonthIndexOfYear($calendar->month_index);
    }

    public function forCalendarDay(Calendar $calendar): Epoch
    {
        return $this->forCalendarYear($calendar)
            ->getByDate($calendar->year, $calendar->month_index, $calendar->day + 1);
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
        $calendar = $this->calendar->replicate()
            ->setDate($era->year)
            ->startOfYear();

        return $this->processor($calendar, false)
            ->processUntilDate($era->year, $era->month, $era->day+1)
            ->last();
    }

    public function incrementDay(Calendar $calendar, Epoch $epoch)
    {
        return $this->incrementDays($calendar, $epoch, 1);
    }

    public function incrementDays(Calendar $calendar, Epoch $epoch, $days = 1)
    {
        // First we want to check whether we're asking for a date in the same year.
        // If we are? EZPZ! We've already calculated that year, let's just find it in our epochs array.
        $theoreticalNewDayOfYear = ($epoch->dayOfYear + $days);

        if(0 < $theoreticalNewDayOfYear && $theoreticalNewDayOfYear < $calendar->year_length) {
            return $this->epochs->where('epoch', '=', ($epoch->epoch + $days))->sole();
        }

        // Ok ... So we want a date from _another_ year. Time to think up a different strategy here.
        // What I would **love** to do is just self::calculateForEpoch($epoch->epoch + $days).
        // That would be fantastic, and would be a universal strategy, I think.
        // Otherwise, we have to figure out a guessing-game strategy here
        //... Which would end up being a calculateForEpoch method. =]

        return $epoch;
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
        $calendar = $calendar ?? $this->calendar->replicate();
        $state = new State($calendar);

        if(!$withEras) {
            $state->disableEras();
        }

        $state->initialize();

        return new Processor($calendar, $state);
    }
}
