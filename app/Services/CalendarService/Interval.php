<?php


namespace App\Services\CalendarService;


use App\Collections\IntervalsCollection;
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

    /**
     * Provides a vote on whether or not the interval would fall on a certain year
     *
     * @param $year
     * @return string
     */
    public function voteOnYear($year): string
    {
        if((($year-$this->offset) % $this->interval) === 0) {
            return $this->subtractor ? 'deny' : 'allow';
        }
        return 'abstain';
    }

    /**
     * Sets this->internalIntervals to an empty collection
     *
     * @return $this
     */
    public function clearInternalIntervals(): Interval
    {
        $this->internalIntervals = new IntervalsCollection();
        return $this;
    }

    /**
     * Determines whether or not this interval is the same as another
     *
     * @param $interval
     * @return bool
     */
    public function isEqual($interval): bool
    {
        return $this == $interval;
    }

    /**
     * Merge the given collection into this->internalIntervals
     *
     * @param $collection
     * @return $this
     */
    public function mergeInternalIntervals($collection): Interval
    {
        $this->internalIntervals = $this->internalIntervals->merge($collection);

        return $this;
    }


    /**
     * Determines whether or not this interval is necessary, given its internal intervals
     *
     * @return bool
     */
    public function isRedundant(): bool
    {
        return $this->internalIntervals
                ->reject->willCollideWith($this)
                ->count()
            && !$this->internalIntervals->count();
    }

    /**
     * Pass through a single interval to `avoidDuplicateCollisionsOnInternal`
     * or, if given a collection of intervals, do it to *all* of them
     *
     * @param $toCheck
     * @return Interval|IntervalsCollection
     */
    public function avoidDuplicates($toCheck)
    {
        if($toCheck instanceof Interval) {
            return $this->avoidDuplicateCollisionsOnInternal($toCheck);
        }

        return $toCheck->map(function($interval){
            return $this->avoidDuplicateCollisionsOnInternal($interval);
        });
    }

    /**
     * When given an interval or a collection of them, destructively update ourselves following these rules:
     * - If a given interval would ever collide with us,
     *      - See if the collision point is already in our internal list
     *          - If so, remove the first instance of it
     *          - If not, negate and add it
     *
     * We then return **the same interval you gave us**
     *
     * @param Interval $suspectedCollision
     * @return Interval
     */
    public function avoidDuplicateCollisionsOnInternal(Interval $suspectedCollision): Interval
    {
        if (!lcmo_bool($this, $suspectedCollision)) {
            return $suspectedCollision;
        }

        $this->internalIntervals->cancelOutCollision($this, $suspectedCollision);

        return $suspectedCollision;
    }

    /**
     * Determines whether this interval has the given attributes.
     * This is some syntactic sugar for collection filtering.
     *
     * @param $interval
     * @param $offset
     * @param $subtractor
     * @return bool
     */
    public function attributesAre($interval, $offset, $subtractor): bool
    {
        return ($this->interval == $interval
            && $this->offset == $offset
            && $this->subtractor == $subtractor);
    }

    /**
     * Create a copy of this interval
     *
     * @return Interval
     */
    public function clone(): Interval
    {
        return clone $this;
    }

    /**
     * Determines whether a given interval will ever collide with this one
     *
     * @param Interval $interval
     * @return bool
     */
    public function willCollideWith(Interval $interval): bool
    {
        return lcmo_bool($this, $interval) || $this->subtractor == $interval->subtractor;
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

        return $this->attributesAre($collidingInterval->interval, $collidingInterval->offset, $internalInterval->subtractor);
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
