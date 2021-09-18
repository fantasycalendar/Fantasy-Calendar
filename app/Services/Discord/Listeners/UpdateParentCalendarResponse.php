<?php

namespace App\Services\Discord\Listeners;

use App\Events\ChildCalendarsUpdated;
use App\Services\Discord\API\Client;
use App\Services\Discord\Commands\Command\DateChangesHandler;
use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Models\DiscordInteraction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Str;

class UpdateParentCalendarResponse
{
    private Client $api;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        $this->api = new Client();
    }

    /**
     * Handle the event.
     *
     * @param  ChildCalendarsUpdated  $event
     * @return void
     */
    public function handle(ChildCalendarsUpdated $event)
    {
        logger()->debug("We got called on UpdateParentCalendarResponse! Batch ID: {$event->batch->id}");
        try {
            $interaction = DiscordInteraction::needsFollowUp()->latestFor($event->calendar)
                ->firstOrFail();
        } catch (\Throwable $e) {
            return;
        }

        logger()->debug(json_encode($interaction));

        $payload = optional($interaction->parent)->payload ?? $interaction->payload;

        $commandInstance = new DateChangesHandler($payload);

        if($commandInstance->setting('show_children') != $event->calendar->id){
            logger()->debug('Not showing children');
            return;
        }
        $response = $commandInstance->respondWithChildren(null, null, null, false, true);

        $this->api->followupMessage($response, $interaction->token);

        DiscordInteraction::where('calendar_id', $event->calendar->id)->update([
            'needs_follow_up' => false
        ]);
    }
}
