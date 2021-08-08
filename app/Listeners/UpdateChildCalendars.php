<?php

namespace App\Listeners;

use App\Events\DateChanged;
use App\Jobs\SyncCalendarChild;
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
        logger()->debug('DateChanged handler, handling for: ' . $event->calendar->children->map->name->join(','));

        $event->calendar->children
            ->each(function($child) use ($event){
                logger()->debug("Firing SyncCalendarChild for: " . $child->name);
                SyncCalendarChild::dispatch($event->calendar, $child, $event->targetEpoch);
            });
    }
}
