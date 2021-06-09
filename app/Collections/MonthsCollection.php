<?php


namespace App\Collections;


use App\Calendar;
use App\Services\CalendarService\Era;
use App\Services\CalendarService\Month;

class MonthsCollection extends \Illuminate\Support\Collection
{
    /**
     * Creates a MonthsCollection based on an array
     *
     * @param $array
     * @param Calendar $calendar
     * @return static
     */
    public static function fromArray($array, Calendar $calendar): self
    {
        $monthsArray = collect($array)->map(function($item, $key){
            return array_merge($item, ["id" => $key]);
        });

        return (new self($monthsArray
                ->mapInto(Month::class)
                ->each->setCalendar($calendar)));
    }

    /**
     * If given an era, the collection will be truncated to the months
     * visible that year and the last month will have its days trimmed
     *
     * @param $era
     * @return $this
     */
    public function endsOn($era): self
    {
        return (!$era)
            ? $this
            : (new self($this->slice(0, $era->month+1)->trimLastMonth($era)));
    }

    /**
     * Trims the last month's days in the collection to be in line with
     * the true year length due to year ending eras
     *
     * @param Era $era
     * @return $this
     */
    private function trimLastMonth(Era $era): self
    {
        $this->last()->daysInYear = $this->last()->daysInYear->slice(0, $era->day);
        return $this;
    }

}
