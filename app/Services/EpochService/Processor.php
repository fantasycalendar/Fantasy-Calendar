<?php


namespace App\Services\EpochService;


use App\Models\Calendar;
use App\Collections\EpochsCollection;
use App\Exceptions\InvalidDateException;
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
     * @param $state
     */
    public function __construct(Calendar $calendar, State $state)
    {
        $this->state = $state;
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

        $this->epochs->insertFromArray($this->state->toArray());

        return $this->getEpochs();
    }

    /**
     * Step forward until a certain date is reached.
     *
     * @param int $year
     * @param int $month
     * @param int $day
     * @return EpochsCollection
     * @throws InvalidDateException
     */
    public function processUntilDate(int $year, int $month = 0, int $day = 1): EpochsCollection
    {
        return $this->processUntil(function($processor) use ($year, $month, $day){
//            logger()->debug("Processing " . date_slug($processor->state->year, $processor->state->monthIndexOfYear, $processor->state->day) . ' to find ' . date_slug($year, $month, $day));

            if($processor->state->year >= $year && $processor->state->monthIndexOfYear > $month) {
                throw new InvalidDateException("Tried to generate past " . date_slug($year, $month, $day - 1) . " to " . date_slug($processor->state->year, $processor->state->monthIndexOfYear, $processor->state->day) . ". Was an invalid date provided?");
            }

            return $processor->state->year == $year
                && $processor->state->monthIndexOfYear == $month
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

        $this->state->stepForward();
    }
}
