<?php


namespace App\Services\EpochService;


use App\Calendar;
use App\Collections\EpochsCollection;
use App\Services\CalendarService\Era;
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
        $date = date_slug($year, $month, $day);

        if(!$this->epochs->has($date)) {
            $calendar = $this->calendar
                ->replicate()
                ->setDate($year, $month, $day);

            $this->processor($calendar)
                ->processUntil(function($processor) use ($year, $month, $day) {
                    return $processor->state->month >= $month
                        && $processor->state->day > $day;
                })->each(function($epoch){
                    $this->addForDate($epoch);
                });
        }

        return $this->epochs->get($date);
    }

    public function forEra(Era $era)
    {
        Log::debug('EpochFactory::forEra - ' . date_slug($era->year, $era->month, $era->day));

        return $this->forDate($era->year, $era->month, $era->day);
    }

    public function processYear()
    {
        $processor = $this->processor();

        $processor->processUntil(function($processor){
            return $processor->state->year == ($this->calendar->year + 1);
        })->each(function($epoch){
            $this->addForDate($epoch);
        });

        return $this->epochs;
    }

    public function addForDate($epoch)
    {
        $this->epochs->insert($epoch);
    }

    private function processor($calendar = null)
    {
        return new Processor($calendar ?? $this->calendar);
    }
}
