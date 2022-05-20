<?php


namespace App\Collections;


use App\Exceptions\InvalidLeapDayIntervalException;
use App\Services\CalendarService\Interval;
use Illuminate\Support\Facades\Log;

class IntervalsCollection extends \Illuminate\Support\Collection
{
    public static function fromString($intervalString, $offset)
    {
        $items = self::splitFromString($intervalString, $offset);

        if(!count($items) > 0) {
            throw new InvalidLeapDayIntervalException('An invalid value was provided for the interval of a leap day: ' . $intervalString);
        }

        // If the smallest item is a subtracts (!), it contributes nothing. As such, we remove it.
        return (new self($items))
            ->reverse()
            ->skipWhile->subtracts
            ->reverse()
            ->values();
    }

    /**
     * Turns an interval string and offset into an array of Interval objects
     *
     * @param $intervalString
     * @param $offset
     * @return array
     */
    public static function splitFromString($intervalString, $offset): array
    {
        return array_map(
            function($item) use ($offset) {
                return new Interval($item, $offset);
            },
            explode(',', $intervalString)
        );
    }

    public function toJsons()
    {
        return json_encode($this->map->toJson()->values());
    }

    /**
     * Check to see whether or not this collection of intervals (Usually on a Leap Day) should add days on year 0
     *
     * @return mixed
     */
    public function bumpsYearZero()
    {
        $firstValidInterval = $this->reject->offset->sortByDesc('interval')->first();

        if($firstValidInterval) return !$firstValidInterval->subtracts;

        return false;
    }

    /**
     * Recursively avoid interval collisions
     *
     * @param $intervals
     * @return mixed
     */
    public function avoidDuplicateCollisions(IntervalsCollection $intervals): IntervalsCollection
    {
        $intervals = clone $intervals;

        if($intervals->count() == 1) {
            return $intervals;
        }

        $first = $intervals->shift();

        $suspectedCollisions = $intervals->avoidDuplicateCollisions($intervals);

        return $suspectedCollisions->map(function($interval) use (&$first){
            if(!$interval->subtracts) {
                $first->avoidDuplicates($interval);
            }

            $interval->internalIntervals = $first->avoidDuplicates($interval->internalIntervals);

            return $interval;
        })->prepend($first);
    }

    /**
     * Normalize our intervals so that they are actually useful.
     * The main goal here is to provide a list of anywhere these intervals collide.
     *
     * @return $this
     */
    public function normalize(): IntervalsCollection
    {
        return ($this->count() === 1)
            ? $this
            : $this->cleanUp()
                   ->avoidDuplicateCollisions($this)
                   ->flattenIntervals();
    }

    /**
     * Our intervals have internal intervals, we want to flatten to a single list of all of those,
     * along with any of the "parent" intervals that are **not** subtractss.
     *
     * @return mixed
     */
    private function flattenIntervals()
    {
        return $this
            ->map->internalIntervals
            ->add($this->reject->subtracts)
            ->flatten()
            ->map->clearInternalIntervals()
            ->sortByDesc('interval')
            ->values();
    }

    /**
     * Who knows what users enter, amirite? Clean it up, by avoiding redundancies!
     * For example, we want "100,!100,50,4,!4" to become just "50".
     *
     * @return mixed
     */
    public function cleanUp()
    {
        return $this->fresh()
            ->fillDescendants()
            ->reject->isRedundant()
            ->map->clearInternalIntervals();
    }

    /**
     * Gets a copy of this collection with all its members freshly cloned.
     * That's mostly to avoid odd object pass-by-reference issues.
     *
     * @return IntervalsCollection
     */
    public function fresh(): IntervalsCollection
    {
        return $this->map->clone();
    }

    /**
     * Give each of our intervals a copy of the list of all the intervals after them in the list
     *
     * @return IntervalsCollection
     */
    public function fillDescendants(): IntervalsCollection
    {
        return $this->map(function($interval, $index){
            return $interval->mergeInternalIntervals($this->slice($index + 1));
        });
    }

    /**
     * Takes an interval, along with an interval we suspect collides with it, and ensures that we either:
     *    1. Cancel out any duplicate collisions on that interval, OR
     *    2. Add the collision to that interval's list to be aware of.
     *
     * @param $examinedInterval
     * @param $knownCollision
     */
    public function cancelOutCollision($examinedInterval, $knownCollision)
    {
        $collidingInterval = lcmo($examinedInterval, $knownCollision);
        $foundInterval = $this->filter
            ->attributesAre($collidingInterval->interval, $collidingInterval->offset, $knownCollision->subtracts)
            ->first();

        if ($foundInterval) {
            $foundKey = $this->filter->isEqual($foundInterval)->firstKey();

            $this->forget($foundKey);
        } else {
            $collidingInterval->subtracts = !$knownCollision->subtracts;

            $this->push($collidingInterval);
        }
    }

    /**
     * Determines how many times each of the intervals has appeared up until the given year
     *
     * @param int $year
     * @param bool $yearZeroExists
     * @return int
     */
    public function occurrences(int $year, bool $yearZeroExists): int
    {
        return $this->sum->occurrences($year, $yearZeroExists)
             + $this->addOneForYearZero($year, $yearZeroExists);
    }

    /**
     * Adds one additional occurrence to account for years beyond year zero if year zero exists
     *
     * @param int $year
     * @param bool $yearZeroExists
     * @return int
     */
    private function addOneForYearZero(int $year, bool $yearZeroExists): int
    {
        return $year > 0 && $yearZeroExists && $this->bumpsYearZero() ? 1 : 0;
    }
}
