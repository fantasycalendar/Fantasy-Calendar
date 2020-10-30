<?php

namespace App\Http\Controllers;

use Laravel\Cashier\Http\Controllers\WebhookController as CashierController;
use App\Notifications\SubscriptionConfirmation;
use Auth;

class StripeController extends CashierController
{
    /**
     * Handle invoice payment succeeded.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handleCustomerSubscriptionCreated($payload)
    {
        Notification::route('mail', Auth::user()->email)
            ->notify(new SubscriptionConfirmation(Auth::user()));
    }
}