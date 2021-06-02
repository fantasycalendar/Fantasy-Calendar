<?php


namespace App\Collections;


use App\Exceptions\InvalidLeapDayIntervalException;
use App\Services\CalendarService\Interval;
use Illuminate\Support\Facades\Log;

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
      return $this->reject->offset->sortByDesc('interval')->first()->subtractor;
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

            $dirtyIntervals->slice($outer_index+1)->each(function($innerInterval) use ($outerInterval, $outer_index, $dirtyIntervals, &$cleanIntervals){

                $collidingInterval = lcmo($outerInterval, $innerInterval);

                if($collidingInterval) {

                    // But if the outer interval has the same LCM as the inner one, remove the outer interval, provided if neither or both are subtractors.
                    if (
                        $outerInterval->interval == $collidingInterval->interval
                        &&
                        $outerInterval->offset == $collidingInterval->offset
                        &&
                        (
                            (!$outerInterval->subtractor && !$innerInterval->subtractor) || ($outerInterval->subtractor && $innerInterval->subtractor)
                        )
                    ) {
                        $cleanIntervals = $cleanIntervals->reject(function ($interval) use ($outerInterval){
                            return $interval == $outerInterval;
                        });
                        return false;
                    }

                    // If the two intervals cannot cancel each other out, skip to the next outer interval
                    if($outerInterval->subtractor xor $innerInterval->subtractor){
                        return false;
                    }

                    return;

                }
                // If the outer interval did not match the inner interval, and it is a subtractor, and there are no more intervals, remove this interval
                if ($outer_index + 2 >= $dirtyIntervals->count() && $outerInterval->subtractor) {

                    $cleanIntervals = $cleanIntervals->reject(function ($interval) use ($outerInterval) {
                        return $interval == $outerInterval;
                    });

                    return false;
                }

            });
        });

//        dd($cleanIntervals->reverse()->values()->mapWithKeys(function($interval, $index) use ($cleanIntervals){
//            return $interval->generateSubIntervals($cleanIntervals->reverse()->values()->slice($index+1));
//        }));

        $cleanIntervals = $cleanIntervals->values();

        for($outer_index = $cleanIntervals->count()-1; $outer_index >= 0; $outer_index--) {
            $outerInterval = $cleanIntervals->get($outer_index);
//            Log::debug("Iterating over outer interval " . $outerInterval->intervalString);

            for ($inner_index = $outer_index + 1; $inner_index < $cleanIntervals->count(); $inner_index++) {

                $innerInterval = $cleanIntervals->get($inner_index);
//                Log::debug("-> Iterating over inner interval " . $innerInterval->intervalString);

//                dump("Outer: ", $outerInterval, ($outerInterval->subtractor ? 'True' : 'False'), "Inner: ", $innerInterval, ($innerInterval->subtractor ? 'True' : 'False'));

                if(!$innerInterval->subtractor) {
//                    Log::debug("--> Inner interval {$innerInterval->intervalString} is NOT a subtractor!");

                    $collidingInterval = lcmo($outerInterval, $innerInterval);

                    if ($collidingInterval) {
//                        Log::debug("---> Inner {$innerInterval->intervalString} and outer {$outerInterval->intervalString} meet at {$collidingInterval->interval}");

//                        Log::debug("---> Outer internals are currently: " . json_encode($outerInterval->internalIntervals, JSON_PRETTY_PRINT));

                        $foundInterval = $outerInterval->internalIntervals->filter(function($interval) use ($collidingInterval, $innerInterval){
//                            Log::debug("-----> Checking {$interval->interval} against {$collidingInterval->interval}: " . ($interval->interval == $collidingInterval->interval ? "True" : "False"));
//                            Log::debug("-----> Checking {$interval->offset} against {$collidingInterval->offset}: " . ($interval->offset == $collidingInterval->offset ? "True" : "False"));
//                            Log::debug("-----> Checking {$interval->subtractor} against {$innerInterval->subtractor}: " . ($interval->subtractor == $innerInterval->subtractor ? "True" : "False"));

                            $result = ($interval->interval == $collidingInterval->interval
                                && $interval->offset == $collidingInterval->offset
                                && $interval->subtractor == $innerInterval->subtractor);

//                            Log::debug("-----> Result: {$result}");

                            return $result;
                        })->first();

                        if($foundInterval){
//                            Log::debug("---> Found Interval: " . $foundInterval->toJson());

                            $initial = $outerInterval->internalIntervals->count();

                            $outerInterval->internalIntervals = $outerInterval->internalIntervals->reject(function($interval) use ($foundInterval){
                                if($interval == $foundInterval) {
                                    $first = $interval->toJson();
                                    $second = $foundInterval->toJson();

//                                    Log::debug("----> Removing {$first} due to a match to {$second}");
                                }

                                return $interval == $foundInterval;
                            });

                            $after = $outerInterval->internalIntervals->count();

                            $result = $outerInterval->internalIntervals->toJson();
//                            Log::debug("----> State after removing " . ($initial - $after) . " sub-intervals from {$outerInterval->interval}:");
//                            Log::debug("----> {$result}");

                        }else{
//                            Log::debug("---> No Found Intervals.");

                            $collidingInterval->subtractor = !$innerInterval->subtractor;

//                            Log::debug("----> Adding {$collidingInterval->interval} to {$outerInterval->interval} as a " . ($collidingInterval->subtractor ? "subtractor" : "non-subtractor"));

                            $outerInterval->internalIntervals->push($collidingInterval);

                        }

                    }
                }

//                Log::debug("--> Iterating over {$innerInterval->interval} internal intervals, which are: " . json_encode($innerInterval->internalIntervals, JSON_PRETTY_PRINT));
                foreach($innerInterval->internalIntervals as $innermostInterval) {
//                    Log::debug("----------> Checking for collisions on {$innermostInterval->interval}");

                    $collidingInterval = lcmo($outerInterval, $innermostInterval);

                    if($collidingInterval){
//                        Log::debug("-----------> Innermost {$innermostInterval->interval} and {$outerInterval->interval} meet at {$collidingInterval->interval}");

                        $negator = (($outerInterval->subtractor && !$innermostInterval->subtractor) || (!$outerInterval->subtractor && !$innermostInterval->subtractor));

//                        Log::debug("-----------> Negator is {$negator}");

                        $foundInterval = $outerInterval->internalIntervals->filter(function($interval) use ($collidingInterval, $negator){
//                            Log::debug("------------> Checking {$interval->interval} against {$collidingInterval->interval}: " . ($interval->interval == $collidingInterval->interval ? "True" : "False"));
//                            Log::debug("------------> Checking {$interval->offset} against {$collidingInterval->offset}: " . ($interval->offset == $collidingInterval->offset ? "True" : "False"));
//                            Log::debug("------------> Checking {$interval->subtractor} IS NOT {$negator}: " . ($interval->subtractor !== $negator ? "True" : "False"));

                            return $interval->interval == $collidingInterval->interval
                                && $interval->offset == $collidingInterval->offset
                                && $interval->subtractor !== $negator;
                        })->first();

                        if($foundInterval){
//                            Log::debug("----------> Found Interval: " . $foundInterval->toJson());

                            $initial = $outerInterval->internalIntervals->count();

                            $foundKey = $outerInterval->internalIntervals->filter(function($interval) use ($foundInterval){
                                if($interval == $foundInterval) {
                                    $first = $interval->toJson();
                                    $second = $foundInterval->toJson();

//                                    Log::debug("-----------> Removing {$first} due to a match to {$second}");
                                }

                                return $interval == $foundInterval;
                            })->keys()->first();

                            $outerInterval->internalIntervals->forget($foundKey);

                            $after = $outerInterval->internalIntervals->count();

                            $result = $outerInterval->internalIntervals->toJson();
//                            Log::debug("-----------> State after removing " . ($initial - $after) . " sub-intervals from {$outerInterval->interval}:");
//                            Log::debug("-----------> {$result}");

                        }else{
//                            Log::debug("----------> No Found Intervals.");

                            $collidingInterval->subtractor = $negator;

//                            Log::debug("-----------> Adding {$collidingInterval->interval} to {$outerInterval->interval} as a " . ($collidingInterval->subtractor ? "subtractor" : "non-subtractor"));

                            $outerInterval->internalIntervals->add($collidingInterval);

                        }

                    }

                }

            }


//            Log::debug("-> At the end of the main loop for {$outerInterval->interval}, our FULL list looks like this: " . json_encode($cleanIntervals, JSON_PRETTY_PRINT));
        }

//        dd($cleanIntervals);

        return $cleanIntervals;
    }

}
