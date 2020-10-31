<?php

namespace App\Http\Controllers;

use Illuminate\Log\Logger;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierController;
use App\Mail\SubscriptionCreated;
use Illuminate\Support\Facades\Mail;
use Auth;
use Laravel\Cashier\Subscription;

class StripeController extends CashierController
{
    /**
     * Handle invoice payment succeeded.
     *
     * @param array $payload
     * @param Subscription $subscription
     * @param Logger $logger
     * @return void
     */
    public function handleCustomerSubscriptionCreated($payload)
    {
        if ($user = $this->getUserByStripeId($payload['data']['object']['customer'])) {
            $subscription = $payload['data']['object'];
            $price = $subscription['items']['data'][0]['plan']['amount'];
            $interval = $subscription['items']['data'][0]['plan']['interval'];
            Log::info($price);
            Log::info($interval);

            Mail::to($user)->send(new SubscriptionCreated($user, $price, $interval));
        }
    }
}
