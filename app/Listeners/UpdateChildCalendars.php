<?php

namespace App\Listeners;

use App\Events\DateChanged;
use Illuminate\Contracts\Queue\ShouldQueue;

class UpdateChildCalendars implements ShouldQueue
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  DateChanged  $event
     * @return void
     */
    public function handle(DateChanged $event)
    {
        logger()->info('DateChanged handler, handling for: ' . $event->calendar->children->map->name->join(','));
        $event->calendar->children
            ->each->setDateFromParentCalendar($event->calendar, $event->epoch)
            ->each->save();
    }
}
