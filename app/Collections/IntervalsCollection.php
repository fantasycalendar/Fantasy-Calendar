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

    /**
     * Normalize our intervals so that they are actually useful.
     * The main goal here is to provide a list of anywhere these intervals collide.
     *
     * @return $this
     */
    public function normalize(): IntervalsCollection
    {
        // If we only have one interval, we can just return it.
        if($this->count() == 1){
            return $this;
        }

        $cleanIntervals = $this->cleanUpIntervals();

        for($outer_index = $cleanIntervals->count()-1; $outer_index >= 0; $outer_index--) {

            $outerInterval = $cleanIntervals->get($outer_index);

            for ($inner_index = $outer_index + 1; $inner_index < $cleanIntervals->count(); $inner_index++) {

                $innerInterval = $cleanIntervals->get($inner_index);

                if (!$innerInterval->subtractor) {

                    $collidingInterval = lcmo($outerInterval, $innerInterval);

                    if ($collidingInterval) {


                        $foundInterval = $outerInterval->internalIntervals->filter(function ($interval) use ($collidingInterval, $innerInterval) {

                            $result = ($interval->interval == $collidingInterval->interval
                                && $interval->offset == $collidingInterval->offset
                                && $interval->subtractor == $innerInterval->subtractor);


                            return $result;
                        })->first();

                        if ($foundInterval) {

                            $initial = $outerInterval->internalIntervals->count();

                            $outerInterval->internalIntervals = $outerInterval->internalIntervals->reject(function ($interval) use ($foundInterval) {
                                if ($interval == $foundInterval) {
                                    $first = $interval->toJson();
                                    $second = $foundInterval->toJson();

                                }

                                return $interval == $foundInterval;
                            });

                            $after = $outerInterval->internalIntervals->count();

                            $result = $outerInterval->internalIntervals->toJson();

                        } else {

                            $collidingInterval->subtractor = !$innerInterval->subtractor;


                            $outerInterval->internalIntervals->push($collidingInterval);

                        }

                    }
                }

                foreach ($innerInterval->internalIntervals as $innermostInterval) {

                    $collidingInterval = lcmo($outerInterval, $innermostInterval);

                    if ($collidingInterval) {

                        $negator = (($outerInterval->subtractor && !$innermostInterval->subtractor) || (!$outerInterval->subtractor && !$innermostInterval->subtractor));

                        $foundInterval = $outerInterval->internalIntervals->filter(function ($interval) use ($collidingInterval, $negator) {

                            return $interval->interval == $collidingInterval->interval
                                && $interval->offset == $collidingInterval->offset
                                && $interval->subtractor !== $negator;
                        })->first();

                        if ($foundInterval) {

                            $initial = $outerInterval->internalIntervals->count();

                            $foundKey = $outerInterval->internalIntervals->filter(function ($interval) use ($foundInterval) {
                                if ($interval == $foundInterval) {
                                    $first = $interval->toJson();
                                    $second = $foundInterval->toJson();

                                }

                                return $interval == $foundInterval;
                            })->keys()->first();

                            $outerInterval->internalIntervals->forget($foundKey);

                            $after = $outerInterval->internalIntervals->count();

                            $result = $outerInterval->internalIntervals->toJson();

                        } else {

                            $collidingInterval->subtractor = $negator;


                            $outerInterval->internalIntervals->add($collidingInterval);

                        }

                    }

                }

            }

        }

        return $this->flattenIntervals($cleanIntervals);

    }

    private function flattenIntervals($cleanIntervals)
    {
        return $cleanIntervals
            ->map->internalIntervals
            ->add($cleanIntervals->reject->subtractor)
            ->flatten()
            ->map->clearInternalIntervals()
            ->sortByDesc('interval')
            ->values();
    }

    public function cleanUpIntervals()
    {
        return $this->map(function($interval, $index){
            $interval = clone $interval;
            return $interval->mergeInternalIntervals($this->slice($index + 1));
        })->reject->isRedundant()->map->clearInternalIntervals();
    }
}
