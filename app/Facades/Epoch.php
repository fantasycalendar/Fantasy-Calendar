<?php


namespace App\Facades;


/**
 * @method static forCalendar(\App\Calendar $calendar)
 */
class Epoch extends \Illuminate\Support\Facades\Facade
{
    protected static function getFacadeAccessor()
    {
        return 'epoch';
    }
}
