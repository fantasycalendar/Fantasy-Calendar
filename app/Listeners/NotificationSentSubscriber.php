<?php

namespace App\Listeners;

use App\Notifications\DiscordDailyStats;
use App\WebhookLog;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Stripe\Webhook;

class NotificationSentSubscriber
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
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {

        if(!$event->notification instanceof DiscordDailyStats) {
            return;
        }

        WebhookLog::create([
            'name' => 'Discord ' . now()->format('Y-m-d'),
            'json' => [
                'total_users' => $event->notification->total_users,
                'monthly_subscribers' => $event->notification->monthly_subscribers,
                'yearly_subscribers' => $event->notification->yearly_subscribers
            ]
        ]);
    }
}
