<?php


namespace App\Services\CalendarService;


use phpDocumentor\Reflection\Types\Collection;

class Interval
{
    public string $intervalString;
    public int $interval;
    public int $offset;
    public bool $subtractor;
    public $internalIntervals;
    public bool $bumpsYearZero;

    /**
     * Interval constructor.
     * @param $interval
     * @param $offset
     */
    public function __construct($interval, $offset)
    {
        $this->intervalString = $interval;
        $this->interval = intval(str_replace('!', '', $interval));;
        $this->subtractor = str_contains($interval, '!');
        $this->internalIntervals = collect([]);

        // If this interval is not 1 and does not ignore offset, normalize offset to the interval
        $ignores_offset = str_contains($interval, '+');
        $this->offset = $this->interval == 1 || $ignores_offset ? 0 : ($this->interval + $offset) % $this->interval;

        $this->bumpsYearZero = ($this->offset === 0 && !$this->subtractor);
    }

    public function toJson()
    {
        return json_encode([
            'interval' => $this->interval,
            'subtractor' => $this->subtractor,
            'offset' => $this->offset
        ], JSON_PRETTY_PRINT);
    }

    public function voteOnYear($year)
    {
        if((($year-$this->offset) % $this->interval) === 0) {
            if($this->subtractor) return 'deny';

            return 'allow';
        }

        return 'abstain';
    }

    /**
     * @param $year
     * @return int
     */
    public function contributionToYear($year): int
    {
        return (int) ceil($year / $this->interval);
    }

    public function generateSubIntervals($intervals)
    {
        return $intervals->map(function($interval){
            if(!$interval->subtractor) {
                $collidingInterval = lcmo($this, $interval);

                if($collidingInterval) {

                }
            }

            return [$interval->interval . '-' . $this->interval . microtime() => $interval];
        });
    }
}
