<?php

namespace App\Listeners;

use App\Mail\SubscriptionCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use Laravel\Cashier\Cashier;
use Laravel\Cashier\Events\WebhookReceived;

class StripeEventListener
{
    /**
     * Handle the event.
     *
     * @param  WebhookReceived  $event
     * @return void
     */
    public function handle(WebhookReceived $event)
    {
        switch ($event->payload['type']) {
            case 'customer.subscription.created':
                $user = Cashier::findBillable($event->payload['data']['object']['customer']);
                if (!$user) {
                    break;
                }
                $subscription = $event->payload['data']['object'];

                $price = $subscription['items']['data'][0]['plan']['amount'];
                $interval = $subscription['items']['data'][0]['plan']['interval'];

                Mail::to($user)->send(new SubscriptionCreated($user, $price, $interval));
                break;
            default:
                break;
        }
    }
}
