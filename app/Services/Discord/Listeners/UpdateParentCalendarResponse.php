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
        $interaction = DiscordInteraction::latestFor($event->calendar);

        if(!Str::contains($interaction->message_text, 'Child calendar dates:')){
            logger()->debug('message text does not include Child calendar dates: '. $interaction->message_text);
            return;
        }

        $commandInstance = new DateChangesHandler($interaction->payload);
        $response = $commandInstance->appendChildDates(Response::make($interaction->message_text), $event->calendar);

        $this->api->followupMessage($response, $interaction->token);
    }
}
