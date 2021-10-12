<?php


namespace App\Services\EpochService\Processor;


use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class InitialStateWithEras extends InitialState
{
    /*
     * Correct for things that are missing because of year-ending eras
     */
    public function generateInitialProperties(): Collection
    {
        return ($this->hasApplicableEras())
            ? $this->takeErasIntoAccount()
            : parent::generateInitialProperties();
    }

    /**
     * @return Collection
     */
    public function takeErasIntoAccount(): Collection
    {
        $values = parent::generateInitialProperties()->collect();
        $eraSubtractables = $this->getSubtractables();

        $values->put('timespanCounts', $this->calculateTimespanCounts($values, $eraSubtractables));
        $values->put('epoch', $values->get('epoch') - $eraSubtractables->sum('epoch'));
        $values->put('historicalIntercalaryCount', $values->get('historicalIntercalaryCount') - $eraSubtractables->sum('historicalIntercalaryCount'));
        $values->put('numberTimespans', $values->get('numberTimespans') - $eraSubtractables->sum('numberTimespans'));
        $values->put('weekdayIndex', $this->determineWeekdayIndex($values->get('epoch'), $values->sum('historicalIntercalaryCount')));

        return $values;
    }

    private function calculateTimespanCounts($state, $eraSubtractables)
    {
        return $state->get('timespanCounts')->map(function($timespanCount, $timespanIndex) use ($eraSubtractables) {
            return $timespanCount - $eraSubtractables->sum(function($era) use ($timespanIndex){
                    return $era->get('timespanCounts')->get($timespanIndex);
                });
        });
    }

    private function getSubtractables()
    {
        return $this->calendar->eras
            ->filter->endsYear()
            ->filter->beforeYear($this->year)
            ->map->getEpochSubtractables($this->calendar);
    }

    private function hasApplicableEras()
    {
        return $this->calendar->eras
                ->filter->endsYear()
                ->filter->beforeYear($this->year)
                ->count();
    }
}
