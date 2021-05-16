<?php


namespace App\Services\EpochService\Processor;


use Illuminate\Support\Facades\Log;

class InitialStateWithEras extends InitialState
{
    public static function generateFor($calendar)
    {
        Log::info('ENTERING: ' . self::class . '::generateFor');
        return (new self($calendar))->generateInitialProperties();
    }

    /*
     * Correct for things that are missing because of year-ending eras
     */
    public function generateInitialProperties()
    {
        Log::info('ENTERING: ' . self::class . '::generateInitialProperties');
        $state = parent::generateInitialProperties();

        if(!$this->hasApplicableEras()) return $state;

        $eraSubtractables = $this->getSubtractables();

        dd($eraSubtractables);

        // The actual work starts here
        $this->timespanCounts = $this->calculateTimespanCounts($state, $eraSubtractables);

        $this->epoch -= $eraSubtractables->sum('epoch');
        $this->historicalIntercalaryCount -= $eraSubtractables->sum('historicalIntercalaryCount');
        $this->numTimespans -= $eraSubtractables->sum('numTimespans');
        $this->totalWeekNum -= $eraSubtractables->sum('totalWeekNum');

        dd($state->toArray());

        return $this;
    }

    private function calculateTimespanCounts($state, $eraSubtractables)
    {
        Log::info('ENTERING: ' . self::class . '::calculateTimespanCounts');
        return $state->timespanCounts->map(function($timespanCount, $timespanIndex) use ($eraSubtractables) {
            return $timespanCount - $eraSubtractables->sum(function($era) use ($timespanIndex){
                    return $era->timespanCount->get($timespanIndex);
                });
        });
    }

    private function getSubtractables()
    {
        Log::info('ENTERING: ' . self::class . '::getSubtractables');
        return $this->calendar->eras
            ->filter->endsYear()
            ->filter->beforeYear($this->year)
            ->map->getEpochSubtractables($this->calendar);
    }

    private function hasApplicableEras()
    {
        Log::info('ENTERING: ' . self::class . '::hasApplicableEras');
        return $this->calendar->eras
                ->filter->endsYear()
                ->filter->beforeYear($this->year)
                ->count();
    }
}
