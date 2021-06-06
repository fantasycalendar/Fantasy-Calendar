<?php


namespace App\Services\CalendarService;


use App\Calendar;
use App\Collections\IntervalsCollection;
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

        $this->intervals = IntervalsCollection::fromString($this->interval, $this->offset)->normalize();
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

    public function occurrences(int $parentOccurrences)
    {

        $occurrences = 0;

        $yearZeroExists = $this->calendar->setting('year_zero_exists');

        if($parentOccurrences > 0) {

            if($yearZeroExists && $this->intervals->bumpsYearZero()){
                $occurrences++;
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

                $outerOffset = !$yearZeroExists ? $outerInterval->offset - 1 : $outerInterval->offset;

                $year = $outerOffset > 0 ? $parentOccurrences - $outerOffset : $parentOccurrences;

                $result = $year / $outerInterval->interval;

                $occurrences += $outerInterval->subtractor ? 0 : ceil($result);

                foreach($outerInterval->internalIntervals as $innerInterval){

                    $innerOffset = !$yearZeroExists ? $innerInterval->offset - 1 : $innerInterval->offset;

                    $year = $innerOffset > 0 ? $parentOccurrences - $innerOffset : $parentOccurrences;

                    $result = $year / $innerInterval->interval;

                    $occurrences += $innerInterval->subtractor ? ceil($result)*-1 : ceil($result);

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
