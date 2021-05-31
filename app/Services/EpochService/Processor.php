<?php


namespace App\Services\EpochService;


use App\Collections\EpochsCollection;
use App\Services\EpochService\Processor\State;
use Illuminate\Support\Facades\Log;

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

    public function processWhile($whileCondition)
    {
        while($whileCondition($this)) {
            $this->stepForward();
        }

        return $this->getEpochs();
    }

    public function processUntil($stopCondition)
    {
        while($this->shouldContinue($stopCondition)) {
            $this->stepForward();
        }

        return $this->getEpochs();
    }

    public function processUntilDate($year, $month, $day)
    {
        return $this->processUntil(function($processor) use ($year, $month, $day){
            return $processor->state->year = $year
                && $processor->state->month = $month
                && $processor->state->day = $day;
        });
    }

    public function getEpochs()
    {
        return $this->epochs->keyBy('slug');
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
        $arrayified = $this->state->toArray();
        $epoch = new Epoch($arrayified);

        Log::debug('Stepping forward from: ' . $epoch->slugify());
        Log::debug(json_encode($arrayified, true));

        $this->epochs->insert($epoch);

        $this->state->advance();
    }
}
