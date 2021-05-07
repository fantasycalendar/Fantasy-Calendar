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
    /**
     * @var EpochsCollection
     */
    private EpochsCollection $epochs;

    public function __construct()
    {
        $this->epochs = new EpochsCollection();
    }

    public function forCalendar(Calendar $calendar)
    {
        $this->calendar = $calendar;

        return $this;
    }

    public function forDateRange(Date $startDate, Date $endDate)
    {
        $this->
    }
}
