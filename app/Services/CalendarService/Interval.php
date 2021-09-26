<?php


namespace App\Services\CalendarService;


use App\Collections\IntervalsCollection;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use phpDocumentor\Reflection\Types\Collection;

class Interval
{
    public string $intervalString;
    public int $interval;
    public int $offset;
    public bool $subtracts;
    public IntervalsCollection $internalIntervals;
    public bool $bumpsYearZero;
    public $fraction;

    /**
     * Interval constructor.
     * @param $interval
     * @param $offset
     */
    public function __construct($interval, $offset)
    {
        $this->intervalString = $interval;
        $this->interval = intval(str_replace('!', '', $interval));;
        $this->subtracts = str_contains($interval, '!');
        $this->internalIntervals = new IntervalsCollection();

        // If this interval is not 1 and does not ignore offset, normalize offset to the interval
        $ignores_offset = str_contains($interval, '+');
        $this->offset = $this->interval == 1 || $ignores_offset ? 0 : ($this->interval + $offset) % $this->interval;

        $this->bumpsYearZero = ($this->offset === 0 && !$this->subtracts);
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
            'subtracts' => $this->subtracts,
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
        $mod = $year - $this->offset;

        if($year < 0) {
            $mod++;
        }

        if($mod % $this->interval === 0) {
            return $this->subtracts ? 'deny' : 'allow';
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
     * @param $subtracts
     * @return bool
     */
    public function attributesAre($interval, $offset, $subtracts): bool
    {
        return ($this->interval == $interval
            && $this->offset == $offset
            && $this->subtracts == $subtracts);
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
        return lcmo_bool($this, $interval) || $this->subtracts == $interval->subtracts;
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

        return $this->attributesAre($collidingInterval->interval, $collidingInterval->offset, $internalInterval->subtracts);
    }

    /**
     * Determines how many times times this interval has appeared up until the given year
     *
     * @param int $year
     * @param bool $yearZeroExists
     * @return int
     */
    public function occurrences(int $year, bool $yearZeroExists): int
    {
        if($year == 0) {
            return 0;
        }

        if($year > 0) {

            $year = $this->offset > 0 ? $year - $this->offset + $this->interval : $year;

            $year = $yearZeroExists ? $year - 1 : $year;

            $result = $year / $this->interval;

            return $this->subtracts ? floor($result) * -1 : floor($result);

        }

        $outerOffset = $this->offset % $this->interval;

        $result = ($year - ($outerOffset-1)) / $this->interval;

        if($outerOffset === 0){
            $result--;
        }

        return $this->subtracts ? ceil($result) * -1 : ceil($result);
    }

    public function fraction()
    {
        return (($this->subtracts) ? -1 : 1) / $this->interval;
    }
}
