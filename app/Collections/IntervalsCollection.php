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

        // If the smallest item is a subtractor (!), it contributes nothing. As such, we remove it.
        return (new self($items))
            ->reverse()
            ->skipWhile->subtractor
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
        return $this->reject->offset->sortByDesc('interval')->first()->subtractor;
    }

    public function avoidDuplicateCollisions($intervals)
    {
        $intervals = clone $intervals;

        if($intervals->count() == 1) {
            return $intervals;
        }

        $first = $intervals->shift();

        $suspectedCollisions = $intervals->avoidDuplicateCollisions($intervals);

        return $suspectedCollisions->map(function($interval) use (&$first){
            if(!$interval->subtractor) {
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
            : $this->cleanUpIntervals()
                   ->avoidDuplicateCollisions($this)
                   ->flattenIntervals();
    }

    private function flattenIntervals()
    {
        return $this
            ->map->internalIntervals
            ->add($this->reject->subtractor)
            ->flatten()
            ->map->clearInternalIntervals()
            ->sortByDesc('interval')
            ->values();
    }

    public function cleanUpIntervals()
    {
        return $this->fresh()
            ->fillDescendants()
            ->reject->isRedundant()
            ->map->clearInternalIntervals();
    }

    public function fresh()
    {
        return $this->map->clone();
    }

    public function fillDescendants()
    {
        return $this->map(function($interval, $index){
            return $interval->mergeInternalIntervals($this->slice($index + 1));
        });
    }
}
