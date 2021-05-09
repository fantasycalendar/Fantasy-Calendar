<?php


namespace App\Facades;


/**
 * @method static forCalendar(\App\Calendar $calendar)
 * @method static forEra(\App\Services\CalendarService\Era $param)
 */
class Epoch extends \Illuminate\Support\Facades\Facade
{
    protected static function getFacadeAccessor()
    {
        return 'epoch';
    }
}
