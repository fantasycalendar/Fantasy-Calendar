<?php

namespace App\Listeners;

use App\Events\UserSubscribedEvent;
use Laravel\Cashier\Subscription;

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
        $events->listen(
            UserSubscribedEvent::class,
            static::class.'@handleUserSubscribed'
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

    public function handleUserSubscribed($event)
    {
        $user = $event->user;
        $plan = $event->plan;
        $planInterval = explode('_', $plan)[1];

        logger()->channel('discord')->info("'{$user->username}' subscribed on a $planInterval basis!");
        $planActiveCount = Subscription::where("stripe_status", "=", "active")->where("stripe_price", "=", $plan)->count();

        if($planActiveCount % 10 == 0 && $planActiveCount < 100) {
            logger()->channel('discord')->info("That's a total of $planActiveCount $planInterval subscribers.");
            return;
        }

        if($planActiveCount % 100 == 0 && $planActiveCount < 1000) {
            logger()->channel('discord')->info("Whoa! That's a total of $planActiveCount active $planInterval subscribers!");
            return;
        }

        if($planActiveCount % 1000 == 0 && $planActiveCount < 10000) {
            logger()->channel('discord')->info(":tada::tada::confetti_ball::confetti_ball::piñata::confetti_ball::confetti_ball::tada::tada:\n\nHoly cow, we have reached $planActiveCount active $planInterval subscribers. That's insane.");
            return;
        }

        if($planActiveCount % 10000 == 0) {
            logger()->channel('discord')->info("Somebody wake up Axel, he has probably fainted somewhere. We've hit $planActiveCount $planInterval subscribers. Absolutely mental.");
            return;
        }
    }
}
