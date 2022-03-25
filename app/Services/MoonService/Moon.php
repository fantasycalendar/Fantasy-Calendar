<?php

namespace App\Services\MoonService;

use App\Models\Calendar;
use App\Services\CalendarService\Moon as CalendarMoon;
use App\Services\EpochService\Epoch;

class Moon
{
    public Calendar $calendar;

    public function forCalendar(Calendar $calendar)
    {
        $this->calendar = $calendar;
    }

    public function forEpoch(Epoch $epoch)
    {
        return $this->calendar->moons->map(function(CalendarMoon $moon) use ($epoch) {
            [$phase, $phase_epoch] = $moon->calculatePhases($epoch->epoch);

            return [
                'phase' => $phase,
                'phases_total' => $phase_epoch,
            ];
        });
    }
}
