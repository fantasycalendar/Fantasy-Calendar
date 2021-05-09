<?php


namespace App\Services\EpochService\Processor;


use App\Calendar;
use App\Facades\Epoch;
use App\Services\EpochService\Traits\CalculatesAndCachesProperties;

class InitialState
{
    use CalculatesAndCachesProperties;

    protected Calendar $calendar;

    /**
     * State constructor.
     * @param $calendar
     * @param null $nextYearState
     */
    public function __construct($calendar)
    {
        $this->calendar = $calendar;
        $this->statecache = collect();
    }

    public static function generateFor($calendar)
    {
        return (new self($calendar))->generateInitialProperties();
    }

    public function generateInitialProperties()
    {
        // Generate and set any initial properties used for the initial state

        dd($this->epoch, $this->totalDaysFromTimespans, $this->calendar->dynamic_data);

        return collect([
            'epoch' => $this->epoch,
        ]);
    }

    //
    private function calculateEpoch()
    {
        return $this->totalDaysFromTimespans
            + $this->totalLeapdayOccurrences;
    }

    private function calculateTotalDaysFromTimespans()
    {
        return $this->calendar->timespans->sum(function($timespan){
            return $timespan->occurrences($this->year) * $timespan->length;
        });
    }

    private function calculateTimespanOccurrences()
    {
        return $this->calendar->timespans->map->occurrences($this->year);
    }

    private function calculateLeapdayOccurrences()
    {
        return $this->calendar->leap_days->map->occurrencesOnMonthBetweenYears($this->epochStartYear, $this->year, 0);
    }

    private function calculateTotalLeapdayOccurrences()
    {
        return $this->leapDayOccurrences->sum();
    }

    private function calculateYear()
    {
        return $this->calendar->year;
    }

    private function calculateEpochStartYear()
    {
        return $this->calendar->setting('year_zero_exists')
            ? 0
            : 1;
    }
}

// |------------|---------------------|
//              ^                     ^
//          Era start           Next year start
