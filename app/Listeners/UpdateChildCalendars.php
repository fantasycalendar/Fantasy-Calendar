<?php

namespace App\Listeners;

use App\Events\DateChanged;
use App\Facades\Epoch;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateChildCalendars
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
        $event->calendar->children->each(function($child) use ($event){
            $targetEpoch = $event->epoch - $child->parent_offset;

            Epoch::forCalendar($child);
        });
    }
}
