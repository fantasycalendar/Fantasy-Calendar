<?php


namespace App\Services\EpochService;


use App\Calendar;
use App\Collections\EpochsCollection;
use App\Services\CalendarService\Date;
use App\Services\CalendarService\Era;
use App\Services\EpochService\Processor\InitialState;
use App\Services\EpochService\Processor\State;
use Illuminate\Support\Facades\Log;

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

    public function forCalendar(Calendar $calendar)
    {
        $this->calendar = $calendar->startOfYear();
        $this->epochs = new EpochsCollection();

        return $this;
    }

    public function forCalendarYear(Calendar $calendar)
    {
        return $this->forCalendar($calendar)->processYear();
    }

    public function forDate($year, $month, $day)
    {
        $dateslug = date_slug($year, $month, $day);

        if(!$this->epochs->has($dateslug)) {
            $epochs = $this->processor()->processUntilDate($year, $month, $day);
        }

        dd($epochs);

        return $this->epochs->get($dateslug);
    }

    public function forEra(Era $era)
    {
        $date = date_slug($era->year, $era->month, $era->day);

        Log::debug('EpochFactory::forEra - ' . $date);

        if(!$this->epochs->has($date)) {
            $calendar = $this->calendar
                             ->replicate()
                             ->setDate($era->year, $era->month, $era->day);

            $epochs = $this->processor($calendar)->processUntil(function($processor) use ($era) {
                return $processor->state->month >= $era->month
                    && $processor->state->day > $era->day;
            });

            $this->epochs = $this->epochs->merge($epochs);
        }

        return $this->epochs->get($date);
    }

    public function processYear()
    {
        $processor = $this->processor();

        $this->epochs = $this->epochs->merge($processor->processUntil(function($processor){
            return $processor->state->year == ($this->calendar->year + 1);
        }));

        return $this->epochs;
    }

    private function processor($calendar = null)
    {
        return new Processor($calendar ?? $this->calendar);
    }
}
