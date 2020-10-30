<?php

namespace App\Http\Controllers;

use Laravel\Cashier\Http\Controllers\WebhookController as CashierController;
use App\Mail\SubscriptionCreated;
use Illuminate\Support\Facades\Mail;
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
        Mail::to("test@lol.com")->send(new SubscriptionCreated());
    }
}