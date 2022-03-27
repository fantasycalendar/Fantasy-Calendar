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
            [
                $phase,
                $totalPhaseCount,
                $phaseYearCount,
                $phaseMonthCount
            ] = $moon->calculatePhases($epoch);

            return [
                'phase' => $phase,
                'totalPhaseCount' => $totalPhaseCount,
                'phaseYearCount' => $phaseYearCount,
                'phaseMonthCount' => $phaseMonthCount
            ];
        });
    }
}
