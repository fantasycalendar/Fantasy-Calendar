<?php


namespace App\Facades;


/**
 * @method static forCalendar(\App\Calendar $calendar)
 * @method static forEra(\App\Services\CalendarService\Era $param)
 * @method static forCalendarYear(\App\Calendar $calendar)
 * @method static forCalendarMonth(\App\Calendar $calendar)
 * @method static incrementDay(\App\Calendar $param, mixed $epoch)
 * @method static incrementDays(\App\Calendar $param, mixed $epoch, $number)
 */
class Epoch extends \Illuminate\Support\Facades\Facade
{
    protected static function getFacadeAccessor()
    {
        return 'epoch';
    }
}
