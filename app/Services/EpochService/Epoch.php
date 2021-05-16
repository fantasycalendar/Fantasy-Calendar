<?php


namespace App\Services\EpochService;


use App\Calendar;
use App\Collections\EpochsCollection;
use App\Services\CalendarService\Date;
use App\Services\CalendarService\Era;
use App\Services\EpochService\Processor\InitialState;
use App\Services\EpochService\Processor\State;

class Epoch
{
    /**
     * @var Calendar
     */
    private Calendar $calendar;
    /**
     * @var EpochsCollection
     */
    private EpochsCollection $epochs;

    public function forCalendar(Calendar $calendar)
    {
        $this->calendar = $calendar->startOfYear();
        $this->epochs = new EpochsCollection();

        return $this;
    }

    public function forDate($year, $month, $day)
    {
        $date = $year.'-'.$month.'-'.$day;

        return $this->epochs->get($date);
    }

    public function forEra(Era $era)
    {
        $date = $era->year.'-'.$era->month.'-'.$era->day;

        if(!$this->epochs->has($date)) {
            $calendar = $this->calendar
                             ->replicate()
                             ->setDate($era->year, $era->month, $era->day);

            $eraEpoch = (new Processor($calendar))->processUntil(function($processor) use ($era) {
                return $processor->state->month >= $era->month
                    && $processor->state->day >= $era->day;
            })->last();

            $this->epochs->put($date, $eraEpoch);
        }

        return $this->epochs->get($date);
    }

    public function process()
    {
        $processor = new Processor($this->calendar);

        $this->epochs = $processor->processUntil(function($processor){
            return $processor->state->year == ($this->calendar->year + 1);
        });

        return $this->epochs;
    }
}
