<?php


namespace App\Services\EpochService\Processor;


class InitialStateWithEras extends InitialState
{
    /*
     * Correct for things that are missing because of year-ending eras
     */
    public function generateInitialProperties()
    {
        $state = parent::generateInitialProperties();

        if(!$this->hasApplicableEras()) return $state;

        $eraSubtractables = $this->getSubtractables();

        // The actual work starts here
        $state->timespanCounts = $this->calculateTimespanCounts($state, $eraSubtractables);

        $state->epoch -= $eraSubtractables->sum('epoch');
        $state->historicalIntercalaryCount -= $eraSubtractables->sum('historicalIntercalaryCount');
        $state->numTimespans -= $eraSubtractables->sum('numTimespans');
        $state->totalWeekNum -= $eraSubtractables->sum('totalWeekNum');

        return $state;
    }

    private function calculateTimespanCounts($state, $eraSubtractables)
    {
        return $state->timespanCounts->map(function($timespanCount, $timespanIndex) use ($eraSubtractables) {
            return $timespanCount - $eraSubtractables->sum(function($era) use ($timespanIndex){
                    return $era->timespanCount->get($timespanIndex);
                });
        });
    }

    private function getSubtractables()
    {
        return $this->calendar->eras
            ->filter->endsYear()
            ->filter->beforeYear($this->year)
            ->sortBy('year')
            ->map->getEpochSubtractables($this->calendar);
    }

    private function hasApplicableEras()
    {
        return $this->calendar->eras
                ->filter->endsYear()
                ->filter->beforeYear($this->year)
                ->count() < 1;
    }
}
