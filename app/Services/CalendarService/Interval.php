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

    /**
     * Create a new Interval from string, providing offset
     *
     * @param $interval
     * @param $offset
     * @return Interval
     */
    public static function make($interval, $offset): Interval
    {
        return new self($interval, $offset);
    }

    public function toJson()
    {
        return json_encode([
            'interval' => $this->interval,
            'subtractor' => $this->subtractor,
            'offset' => $this->offset
        ]);
    }

    public function voteOnYear($year)
    {
        if((($year-$this->offset) % $this->interval) === 0) {
            return $this->subtractor ? 'deny' : 'allow';
        }
        return 'abstain';
    }

    public function clearInternalIntervals()
    {
        $this->internalIntervals = collect([]);
        return $this;
    }

    public function isEqual($interval)
    {
        return $this == $interval;
    }

    public function mergeInternalIntervals($collection)
    {
        $this->internalIntervals = $this->internalIntervals->merge($collection);

        return $this;
    }

    public function isRedundant()
    {
        return $this->internalIntervals->reject(function($internalInterval){
            return $this->willCollideWith($internalInterval) || !($this->subtractor xor $internalInterval->subtractor);
        })->count() && !$this->internalIntervals->count();
    }

    /**
     * Determines whether a given interval will ever collide with this one
     *
     * @param Interval $interval
     * @return bool
     */
    private function willCollideWith(Interval $interval): bool
    {
        return lcmo_bool($this, $interval);
    }

    /**
     * Determines if the given interval clashes with this one
     *
     * @param $internalInterval
     * @return bool
     */
    public function matchesCollisionWith($internalInterval): bool
    {
        $collidingInterval = lcmo($this, $internalInterval);
        return $this->interval    == $collidingInterval->interval
            && $this->offset      == $collidingInterval->offset
            && $this->subtractor  == $internalInterval->subtractor;
    }

    /**
     * @param $year
     * @return int
     */
    public function contributionToYear($year): int
    {
        return (int) ceil($year / $this->interval);
    }
}
