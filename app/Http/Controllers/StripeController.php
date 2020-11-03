<?php

namespace App\Http\Controllers;

use Laravel\Cashier\Http\Controllers\WebhookController as CashierController;
use App\Mail\SubscriptionCreated;
use Illuminate\Support\Facades\Mail;
use Laravel\Cashier\Subscription;

class StripeController extends CashierController
{
    /**
     * Handle invoice payment succeeded.
     *
     * @param array $payload
     * @return void
     */
    public function handleCustomerSubscriptionCreated(array $payload)
    {
        if ($user = $this->getUserByStripeId($payload['data']['object']['customer'])) {
            $subscription = $payload['data']['object'];

            $price = $subscription['items']['data'][0]['plan']['amount'];
            $interval = $subscription['items']['data'][0]['plan']['interval'];

            Mail::to($user)->send(new SubscriptionCreated($user, $price, $interval));
        }
    }
}
