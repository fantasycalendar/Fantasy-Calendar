<?php

namespace App\Listeners;

use Laravel\Cashier\Events\WebhookReceived;

class SubscriptionEventListener
{
    /**
     * Handle received Stripe webhooks.
     *
     * @param  \Laravel\Cashier\Events\WebhookReceived  $event
     * @return void
     */
    public function handle(WebhookReceived $event)
    {
        if ($event->payload['type'] === 'invoice.payment_succeeded') {
            logger()->channel('discord')->info("");
        }
    }
}
