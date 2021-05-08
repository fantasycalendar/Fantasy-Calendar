<?php


namespace App\Services\EpochService;


use App\Calendar;
use App\Collections\EpochsCollection;
use App\Services\CalendarService\Date;

class Epoch
{
    /**
     * @var Calendar
     */
    private Calendar $calendar;

    public function forCalendar(Calendar $calendar)
    {
        $this->calendar = $calendar->startOfYear();

        return $this;
    }

    public function process()
    {
        $processor = new Processor($this->calendar);

        $this->epochs = $processor->processUntil(function($processor){
            return $processor->state->year = ($this->calendar->year + 1);
        });

        return $this->epochs;
    }
}
