<?php


namespace App\Services\EpochService;


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

    public function __construct($calendar)
    {
        $this->state = new State($calendar);
        $this->epochs = new EpochsCollection();
    }

    public function processUntil($stopCondition)
    {
        while($this->shouldContinue($stopCondition)) {
            $this->stepForward();
        }

        return $this->epochs;
    }

    public function is($epochNumber)
    {
        return $this->state->day === $epochNumber;
    }

    public function isAtLeast($epochNumber)
    {
        return $this->state->day >= $epochNumber;
    }

    private function shouldContinue($stopCondition): bool
    {
        if(is_int($stopCondition)) {
            return !$this->isAtLeast($stopCondition);
        }

        return !$stopCondition($this);
    }

    private function stepForward()
    {
        $this->epochs->push($this->state->toArray());

        $this->state->advance();
    }
}
