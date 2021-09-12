<?php

namespace App\Listeners;

use App\Events\ChildCalendarsUpdated;
use App\Events\DateChanged;
use App\Jobs\SyncCalendarChild;
use Illuminate\Bus\Batch;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Bus;

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
        $calendar = $event->calendar;

        $events = $calendar->children
            ->map(function($child) use ($event, $calendar){
                return new SyncCalendarChild($calendar, $child, $event->targetEpoch);
            });

        Bus::batch($events)
            ->then(function(Batch $batch) use ($event, $calendar){
                ChildCalendarsUpdated::dispatch($batch, $calendar);
            })->catch(function(Batch $batch, \Throwable $e){
                logger()->error($e);
            })->finally(function(Batch $batch) {
                if($batch->failedJobs) {
                    logger()->error("Uh hey guys a child calendar job failed?!");
                }
            })->dispatch();
    }
}
