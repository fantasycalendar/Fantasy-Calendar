<?php

namespace App\Facades;

/**
 * @method static forEpoch(\App\Services\EpochService\Epoch $epoch): array
 * @method static forCalendar(\App\Models\Calendar $calendar)
 */
class Moons extends \Illuminate\Support\Facades\Facade
{
    protected static function getFacadeAccessor()
    {
        return 'moons';
    }
}
