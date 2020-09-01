<?php

namespace App\Listeners;

class UserEventSubscriber
{
    /**
     * Handle the event.
     *
     * @param  \Illuminate\Events\Dispatcher  $events
     * @return void
     */
    public function subscribe($events)
    {
        $events->listen(
            \Illuminate\Auth\Events\Login::class,
            static::class.'@handleUserLogin'
        );
    }

    public function handleUserLogin($event)
    {
        if(!$event->user->api_token) {
            $event->user->generateApiToken();
        }
    }
}
