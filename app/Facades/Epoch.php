<?php


namespace App\Facades;


/**
 * @method static forCalendar(\App\Models\Calendar $calendar)
 * @method static forEra(\App\Services\CalendarService\Era $param)
 * @method static forCalendarYear(\App\Models\Calendar $calendar)
 * @method static forCalendarMonth(\App\Models\Calendar $calendar)
 * @method static incrementDay(\App\Models\Calendar $param, mixed $epoch)
 * @method static incrementYears(int $years, \App\Models\Concerns\HasDate $param)
 * @method static incrementMonths(int $months, \App\Models\Concerns\HasDate $param)
 * @method static incrementDays(int $days, \App\Models\Concerns\HasDate $param, $epoch = null)
 * @method static flush()
 * @property string slug
 */
class Epoch extends \Illuminate\Support\Facades\Facade
{
    protected static function getFacadeAccessor()
    {
        return 'epoch';
    }
}
