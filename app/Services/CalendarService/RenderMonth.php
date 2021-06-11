<?php

namespace App\Services\CalendarService;

use App\Calendar;
use App\Facades\Epoch as EpochService;
use App\Services\EpochService\Epoch;
use Illuminate\Database\Eloquent\Concerns\HasAttributes;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class RenderMonth
{
    public $calendar;
    private $id;

    public function __construct(Calendar $calendar, $id = null)
    {
        $this->calendar = $calendar;
        $this->id = $id ?? $calendar->month_index;
    }

    /*
     * Returns an 2-dimensional array in the format:
     *
     */
    public function getStructure()
    {
        $epochs = EpochService::forCalendarMonth($this->calendar);

        $weeks = $epochs->chunkByWeeks()->map(function($week){
            return $week->map(function($week){
                $weekdays = collect(range(0, $this->weekdays->count() - 1));

                return $weekdays->mapWithKeys(function($index) use ($week) {
                    return [$index => $week->where('weekdayIndex', $index)->first()];
                });
            });
        });

        return [
            'year' => $this->calendar->year,
            'month' => $this->calendar->month,
            'name' => $this->name,
            'length' => $this->daysInYear->count(),
            'weekdays' => $this->weekdays,
            'weeks' => $weeks
        ];
    }

    public function __get($name)
    {
        return $this->calendar->months[$this->id]->$name;
    }
}
