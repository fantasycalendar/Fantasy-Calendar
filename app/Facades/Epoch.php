<?php


namespace App\Facades;


/**
 * @method static forCalendar(\App\Calendar $calendar)
 * @method static forEra(\App\Services\CalendarService\Era $param)
 * @method static forCalendarYear(\App\Calendar $calendar)
 * @method static forCalendarMonth(\App\Calendar $calendar)
 */
class Epoch extends \Illuminate\Support\Facades\Facade
{
    protected static function getFacadeAccessor()
    {
        return 'epoch';
    }
}
