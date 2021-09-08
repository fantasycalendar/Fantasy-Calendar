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
        $events->listen(
            \Illuminate\Auth\Events\Authenticated::class,
            static::class.'@handleUserAuthenticated'
        );
    }

    public function handleUserLogin($event)
    {
        if(!$event->user->api_token) {
            $event->user->generateApiToken();
        }
        if($event->user->last_login < now()){
            $event->user->update(["last_login" => now()]);
        }
    }

    public function handleUserAuthenticated($event)
    {
        if($event->user->last_visit < now()){
            $event->user->update(["last_visit" => now()]);
        }
    }
}
