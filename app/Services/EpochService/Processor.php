<?php


namespace App\Services\EpochService;


use App\Calendar;
use App\Collections\EpochsCollection;
use App\Services\EpochService\Processor\State;

class Processor
{
    /**
     * @var EpochsCollection
     */
    private EpochsCollection $epochs;

    /**
     * @var State
     */
    public State $state;

    /**
     * @var Calendar
     */
    private Calendar $calendar;

    /**
     * Processor constructor.
     * @param $calendar
     * @param bool $withEras
     */
    public function __construct($calendar, $withEras = true)
    {
        $this->state = new State($calendar, $withEras);
        $this->epochs = new EpochsCollection();
        $this->calendar = $calendar;
    }

    /**
     * @return mixed
     */
    public function processYear()
    {
        return $this->processUntilDate($this->calendar->year + 1)
                    ->filter->yearIs($this->calendar->year);
    }

    /**
     * Process until callback $untilCondition returns true
     *
     * @param callable $untilCondition
     * @return EpochsCollection
     */
    public function processUntil(callable $untilCondition): EpochsCollection
    {
        while(!$untilCondition($this)) {
            $this->stepForward();
        }

        return $this->getEpochs();
    }

    /**
     * Step forward until a certain date is reached.
     *
     * @param $year
     * @param int $month
     * @param int $day
     * @return EpochsCollection
     */
    public function processUntilDate($year, $month = 0, $day = 1): EpochsCollection
    {
        return $this->processUntil(function($processor) use ($year, $month, $day){
            return $processor->state->year == $year
                && $processor->state->monthIndexInYear == $month
                && $processor->state->day == $day;
        });
    }

    /**
     * Get all of the epochs from this processor, keyed by a date slugged like '2021-6-6'
     *
     * @return EpochsCollection
     */
    public function getEpochs(): EpochsCollection
    {
        return $this->epochs->keyBy('slug');
    }

    /**
     * Step our state forward 1 day
     *
     * @return void
     */
    private function stepForward(): void
    {
        $this->epochs->insertFromArray($this->state->toArray());

        $this->state->incrementDay();
    }
}
