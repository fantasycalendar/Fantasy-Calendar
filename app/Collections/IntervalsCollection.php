<?php


namespace App\Collections;


use App\Exceptions\InvalidLeapDayIntervalException;
use App\Services\CalendarService\Interval;

class IntervalsCollection extends \Illuminate\Support\Collection
{
    public static function fromString($intervalString, $offset)
    {
        $items = array_map(function($item) use ($offset) {return new Interval($item, $offset);}, explode(',', $intervalString));

        if(!count($items) > 0) {
            throw new InvalidLeapDayIntervalException('An invalid value was provided for the interval of a leap day: ' . $intervalString);
        }

        return (new self($items))->reverse()->skipWhile->subtractor->reverse()->values();
    }

    public function bumpsYearZero()
    {
      return $this->reject->offset->max('interval')->subtractor;
    }

    public function normalize()
    {
        // If we only have one interval, we can just return that.
        if($this->count() == 1){
            return $this;
        }

        $dirtyIntervals = $this;
        $cleanIntervals = new self($this->toArray());

        $dirtyIntervals->each(function($outerInterval, $outer_index) use ($dirtyIntervals, &$cleanIntervals) {

            $dirtyIntervals->splice($outer_index+1)->each(function($innerInterval) use ($outerInterval, $outer_index, $dirtyIntervals, &$cleanIntervals){

                $collidingInterval = lcmo($outerInterval, $innerInterval);

                if($collidingInterval) {

                    // But if the outer interval has the same LCM as the inner one, remove the outer interval, provided if neither or both are subtractors.
                    if (
                        $outerInterval->interval == $collidingInterval->interval
                        &&
                        $outerInterval->offset == $collidingInterval->offset
                        &&
                        $outerInterval->subtractor === $innerInterval->subtractor
                    ) {
                        $cleanIntervals = $cleanIntervals->reject(function ($interval) use ($outerInterval){
                            return $interval == $outerInterval;
                        });
                        return;
                    }

                    // If the two intervals cannot cancel each other out, skip to the next outer interval
                    if($outerInterval->subtractor xor $innerInterval->subtractor){
                        return;
                    }

                }

                // If the outer interval did not match the inner interval, and it is a subtractor, and there are no more intervals, remove this interval
                if($outer_index+2 >= $dirtyIntervals->count() && $outerInterval->subtractor){

                    $cleanIntervals = $cleanIntervals->reject(function ($interval) use ($outerInterval){
                        return $interval == $outerInterval;
                    });

                }

            });
        });

        for($outer_index = 0; $outer_index < $cleanIntervals->count(); $outer_index++) {

            $outerInterval = $cleanIntervals->get($outer_index);

            for ($inner_index = $outer_index + 1; $inner_index < $cleanIntervals->count(); $inner_index++) {

                $innerInterval = $cleanIntervals->get($inner_index);

                $subtractor = ($outerInterval->subtractor && !$innerInterval->subtractor) || ($outerInterval->subtractor && $innerInterval->subtractor);

                if($subtractor) {

                    $collidingInterval = lcmo($outerInterval, $innerInterval);

                    if ($collidingInterval) {

                        $foundInterval = $outerInterval->internalIntervals->filter(function($interval) use ($collidingInterval, $subtractor){
                            return $interval->interval == $collidingInterval->interval
                                && $interval->offset == $collidingInterval->offset
                                && $interval->subtractor != $subtractor;
                        })->first();

                        if($foundInterval){

                            $outerInterval = $outerInterval->internalIntervals->reject(function($interval) use ($foundInterval){
                                return $interval == $foundInterval;
                            });

                        }else{

                            $collidingInterval->subtractor = true;

                            $outerInterval->internalIntervals->add($collidingInterval);

                        }

                    }
                }

                foreach($innerInterval->internalIntervals as $innermostInterval){

                    $collidingInterval = lcmo($outerInterval, $innermostInterval);

                    if($collidingInterval){

                        $subtractor = ($outerInterval->subtractor && !$innermostInterval->subtractor) || ($outerInterval->subtractor && $innermostInterval->subtractor);

                        $foundInterval = $outerInterval->internalIntervals->filter(function($interval) use ($collidingInterval, $subtractor){
                            return $interval->interval == $collidingInterval->interval
                                && $interval->offset == $collidingInterval->offset
                                && $interval->subtractor != $subtractor;
                        })->first();

                        if($foundInterval){

                            $outerInterval = $outerInterval->internalIntervals->reject(function($interval) use ($foundInterval){
                                return $interval == $foundInterval;
                            });

                        }else{

                            $collidingInterval->subtractor = $subtractor;

                            $outerInterval->internalIntervals->add($collidingInterval);

                        }

                    }

                }

            }

        }

        return $cleanIntervals;
    }

}
