<?php

namespace App\Services\CalendarService;

use App\Models\Calendar;
use Illuminate\Support\Collection;

class CalendarManager
{
    private Collection $calendars;
    private string $currentHash;

    public function __construct()
    {
        $this->calendars = collect();
    }

    public function using(string|Calendar $calendar): Calendar
    {
        if(is_string($calendar)) {
            $calendar = Calendar::hash($calendar)->first();
        }

        $this->currentHash = $calendar->hash;
        if(!$this->calendars->has($this->currentHash)) {
            $this->calendars->put($this->currentHash, $calendar);
        }

        return $calendar;
    }

    public function retrieve(): Calendar
    {
        if(!$this->currentHash) {
            throw new \Exception("Attempted to retrieve a calendar without having one set.");
        }

        return $this->calendars->get($this->currentHash);
    }
}
