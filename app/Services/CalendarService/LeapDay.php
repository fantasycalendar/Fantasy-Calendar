<?php


namespace App\Services\CalendarService;


use App\Calendar;
use App\Exceptions\InvalidLeapDayIntervalException;
use FontLib\Table\Type\post;
use Illuminate\Support\Arr;

/**
 * Class Interval
 * @package App\Services\CalendarService
 * @property $name
 * @property $intercalary
 * @property $timespan
 * @property $removes_day
 * @property $removes_week_day
 * @property $adds_week_day
 * @property $day
 * @property $week_day
 * @property $interval
 * @property $intervals
 * @property $offset
 * @property mixed not_numbered
 * @property mixed show_text
 */
class LeapDay
{
    public Calendar $calendar;
    private array $originalAttributes;
    public $name;
    public $intercalary;
    public $timespan;
    public $adds_week_day;
    public $day;
    public $week_day;
    public $interval;
    public $offset;
    public $not_numbered;
    public $show_text;

    /**
     * Interval constructor.
     * @param $calendar
     * @param $attributes
     */
    public function __construct(Calendar $calendar, array $attributes)
    {
        $this->originalAttributes = $attributes;
        $this->calendar = $calendar;
        $this->name = Arr::get($attributes, "name");
        $this->intercalary = Arr::get($attributes, "intercalary");
        $this->timespan = $this->calendar->timespans->get(Arr::get($attributes, "timespan"));
        $this->adds_week_day = Arr::get($attributes, "adds_week_day", false);
        $this->day = Arr::get($attributes, "day", 0);
        $this->week_day = Arr::get($attributes, "week_day", false);
        $this->interval = Arr::get($attributes, "interval", "1");
        $this->offset = Arr::get($attributes, "offset", "0");
        $this->not_numbered = Arr::get($attributes, "not_numbered", false);
        $this->show_text = Arr::get($attributes, "show_text", false);

        $this->collectIntervals();
    }

    public function intersectsYear(int $year)
    {
        if($this->intervals->count() === 1) return ['result' => (($year + $this->offset) % $this->interval) == 0];

        $votes = $this->intervals->sortByDesc('years')->map(function($interval) use ($year) {
            return $interval->voteOnYear($year);
        });

        //
        foreach($votes as $vote) {
            if($vote == 'allow') return true;
            if($vote == 'deny') return false;
        }

        return false;
    }

    private function collectIntervals()
    {
        $dirtyIntervals = collect(explode(',', $this->interval));

        if(!$dirtyIntervals->count()) {
            throw new InvalidLeapDayIntervalException('An invalid value was provided for the interval of a leap day: ' . $dirtyIntervals);
        }

        $offset = $this->offset;
        $dirtyIntervals = $dirtyIntervals->map(function($interval) use ($offset){
            return new Interval($interval, $offset);
        });

        // Remove any subtracting intervals (ones with !) from the front, since they cannot negate anything.
        while($dirtyIntervals[$dirtyIntervals->count()-1]->subtractor){
            unset($dirtyIntervals[$dirtyIntervals->count()-1]);
        }

        // If we only have one interval, we can just return that.
        if($dirtyIntervals->count() == 1){
            $this->intervals = $dirtyIntervals;
            return;
        }

        $cleanIntervals = collect($dirtyIntervals);

        for($outer_index = 0; $outer_index < $dirtyIntervals->count(); $outer_index++) {

            $outerInterval = $dirtyIntervals->get($outer_index);

            for($inner_index = $outer_index+1; $inner_index < $dirtyIntervals->count(); $inner_index++) {

                $innerInterval = $dirtyIntervals->get($inner_index);

                $collidingInterval = lcmo($outerInterval, $innerInterval);

                if($collidingInterval) {

                    // But if the outer interval has the same LCM as the inner one, remove the outer interval, provided if neither or both are subtractors.
                    if (
                        $outerInterval->interval == $collidingInterval->interval
                        &&
                        $outerInterval->offset == $collidingInterval->offset
                        &&
                        ((!$outerInterval->subtractor && !$innerInterval->subtractor) || ($outerInterval->subtractor && $innerInterval->subtractor))
                    ) {
                        $cleanIntervals = $cleanIntervals->reject(function ($interval) use ($outerInterval){
                            return $interval == $outerInterval;
                        });
                        break;
                    }

                    // If the two intervals cannot cancel each other out, skip to the next outer interval
                    if($outerInterval->subtractor xor $innerInterval->subtractor){
                        break;
                    }

                }else{

                    // If the outer interval did not match the inner interval, and it is a subtractor, and there are no more intervals, remove this interval
                    if($outer_index+2 >= $dirtyIntervals->count() && $outerInterval->subtractor){
                        $cleanIntervals = $cleanIntervals->reject(function ($interval) use ($outerInterval){
                            return $interval == $outerInterval;
                        });
                        break;
                    }

                }

            }

        }

        for($outer_index = 0; $outer_index < $cleanIntervals->count(); $outer_index++) {

            $outerInterval = $cleanIntervals->get($outer_index);

            for ($inner_index = $outer_index + 1; $inner_index < $cleanIntervals->count(); $inner_index++) {

                $innerInterval = $cleanIntervals->get($inner_index);

                $subtractor = (!$outerInterval->subtractor && !$innerInterval->subtractor) || ($outerInterval->subtractor && $innerInterval->subtractor);

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

                        $subtractor = (!$outerInterval->subtractor && !$innermostInterval->subtractor) || ($outerInterval->subtractor && $innermostInterval->subtractor);

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

        $this->intervals = $cleanIntervals;

    }

    public function occurrences(int $parentOccurrences)
    {

        $occurrences = 0;

        $yearZeroExists = $this->calendar->setting('year_zero_exists');

        if($parentOccurrences > 0) {

            if($yearZeroExists) {

                $negator_zero_offset = false;
                $add_zero_offset = false;

                $reversed = $this->intervals->reverse();

                foreach($reversed as $interval){

                    if($interval->offset == 0){
                        if($interval->subtractor){
                            $negator_zero_offset = true;
                            $add_zero_offset = false;
                        }else{
                            $negator_zero_offset = false;
                            $add_zero_offset = true;
                        }
                    }

                }

                if($add_zero_offset && !$negator_zero_offset){
                    $occurrences++;
                }

            }

            foreach($this->intervals as $outerInterval){

                $year = $outerInterval->offset > 0 ? $parentOccurrences - $outerInterval->offset + $outerInterval->interval : $parentOccurrences;

                $year = $yearZeroExists ? $year - 1 : $year;

                $result = $year / $outerInterval->interval;

                $occurrences += $outerInterval->subtractor ? 0 : floor($result);

                foreach($outerInterval->internalIntervals as $innerInterval){

                    $year = $innerInterval->offset > 0 ? $parentOccurrences - $innerInterval->offset + $innerInterval->interval : $parentOccurrences;

                    $year = $yearZeroExists ? $year - 1 : $year;

                    $result = $year / $innerInterval->interval;

                    $occurrences += $innerInterval->subtractor ? floor($result)*-1 : floor($result);

                }

            }

        } else if($parentOccurrences < 0) {

            foreach($this->intervals as $outerInterval){

                $outerOffset = $yearZeroExists ? $outerInterval->offset - 1 : $outerInterval->offset;

                $year = $outerOffset > 0 ? $parentOccurrences - $outerOffset : $parentOccurrences;

                $result = $year / $outerInterval->interval;

                $occurrences += $outerInterval->subtractor ? 0 : ceil($result);

                foreach($outerInterval->internalIntervals as $innerInterval){

                    $innerOffset = $yearZeroExists ? $innerInterval->offset - 1 : $innerInterval->offset;

                    $year = $innerOffset > 0 ? $parentOccurrences - $innerOffset : $parentOccurrences;

                    $result = $year / $innerInterval->interval;

                    $occurrences += $innerInterval->subtractor ? cil($result)*-1 : ceil($result);

                }

            }

        }

        return (int) $occurrences;

    }

    public function occurrencesOnMonthBetweenYears($start, $end, $month)
    {
        return 0;

        /*if($this->intervals->filter->ignores_offset->count() < 1 && $this->intervals->filter->subtractor->count() < 1) {
            return $this->intervals
                ->map(function($interval) use ($end) {
                    return $interval->contributionToYear($end);
                })->sum();
        }

        dd($this->interval);

        dd($this->intervals->map(function($interval){
            return $interval->contributionToYear($year);
        }));*/
    }

    public function timespanIs($timespan_id)
    {
        return $this->timespan->id === $timespan_id;
    }

    public function toArray()
    {
        return collect(array_keys($this->originalAttributes))
            ->mapWithKeys(function($name){ return [ $name => $this->{$name}]; })
            ->toArray();
    }

    public function __get($name)
    {
        return Arr::get($this->originalAttributes, $name);
    }
}
