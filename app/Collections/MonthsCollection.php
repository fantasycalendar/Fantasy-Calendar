<?php


namespace App\Collections;


use App\Calendar;
use App\Services\CalendarService\Era;
use App\Services\CalendarService\Month;

class MonthsCollection extends \Illuminate\Support\Collection
{

    public static function fromArray($array, Calendar $calendar): self
    {
        return (new self($array))->map(function($timespan_details, $timespan_key) use ($calendar){
            return new Month(array_merge($timespan_details, ['id' => $timespan_key]), $calendar);
        });
    }

    public function endsOn($era): self
    {

        if(!$era) return $this;

        return (new self($this->slice(0, $era->month+1)->trimLastMonth($era)));

    }

    private function trimLastMonth(Era $era){
        $this->last()->daysInYear = $this->last()->daysInYear->slice(0, $era->day);
        return $this;
    }

}
