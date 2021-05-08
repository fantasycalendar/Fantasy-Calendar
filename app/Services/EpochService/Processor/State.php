<?php


namespace App\Services\EpochService\Processor;


use App\Calendar;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class State
{
    public $day = 0;
    private $calendar;
    private \Illuminate\Support\Collection $statecache;
    private \Illuminate\Support\Collection $previousState;
    private \Illuminate\Support\Collection $nextYearState;

    /**
     * State constructor.
     * @param $calendar
     * @param null $nextYearState
     */
    public function __construct($calendar)
    {
        $this->calendar = $calendar;
        $this->statecache = InitialState::generateFor($calendar->startOfYear());
        $this->nextYearState = InitialState::generateFor($calendar->addYear()->startOfYear());
    }

    public function advance()
    {
        $this->day++;

        $this->flushCache();
    }

    public function basics()
    {
        return  [
            // Information that doesn't need next year's state
        ];
    }

    public function toArray(): array
    {
        return [
            'day' => $this->day,
            'year' => $this->year,
            'historicalMoonPhaseCounts' => $this->historicalPhaseCounts,
            'moonPhases' => $this->moonPhases,
        ];
    }

    /*
     * Month in the **displayed** year, zero-indexed
     */
    private function calculateMonth()
    {
        // Compare current day to the previous day's month length
        if(!$this->previousState->has('month')) {
            return 0;
        }
    }

    private function calculateMonthLength()
    {
        //
    }

    private function calculateMonthIndex()
    {

    }

    private function calculateMoonPhases()
    {
        return $this->calendar->moons
            ->map(function($moon) {
                return $moon->setEpoch($this->epoch)->getPhase();
            });
    }

    private function calculateHistoricalPhaseCounts()
    {
        return $this->calendar->moons
            ->map(function($moon){
                return $moon->setEpoch($this->epoch)->getHistoricalPhaseCounts();
            });
    }

    private function calculateYear()
    {
        if($this->day === 0) {
            return ($this->calendar->year_zero_exists)
                ? 0
                : 1;
        }

        return $this->previousState->get('year');
    }

    private function calculateFirstYearLength()
    {
        // Do some epic shit here

        return (int) floor($this->day / $this->firstYearTimespanLengths);
    }

    private function calculateFirstYearTimespanLengths()
    {
        return $this->calendar->timespans
            ->filter(function($timespan){
                return ($timespan->is_intercalary)
                    ? ($timespan->offset == 1 && $timespan->interval == 1)
                    : true;
            })->map(function($timespan){
                return $timespan->length + $this->calendar->leap_days
                    ->filter->timespanIs($timespan->id)
                    ->filter->intersectsYear(0)
                    ->count();
            });
    }

    private function flushCache()
    {
        $this->previousState = $this->statecache;

        $this->statecache = collect();
    }

    private function staticData($key, $default = null)
    {
        return Arr::get($this->calendar->static_data, $key, $default);
    }

    public function getState()
    {
        return $this->statecache;
    }

    public function __get($name)
    {
        if(!$this->statecache->has($name)) {
            $this->statecache->put($name, $this->{'calculate'.Str::studly($name)}());
        }

        return $this->statecache->get($name);
    }
}
