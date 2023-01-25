<?php

namespace App\Models\Concerns;

use Stripe;
use Carbon\Carbon;
use Laravel\Cashier\Subscription;

trait SyncsSubscriptions {

    public function syncSubscriptions()
    {
        if(!$this->stripe_id) {
            return;
        }

        Stripe\Stripe::setApiKey(config('cashier.secret'));

        // NOTE: We will only set one primary subscription.
        $subscription = null;
        $subscription_match = null;
        $subscription_active = null;
        $subscription_current = $this->subscriptions->first();

        $customer = Stripe\Customer::retrieve([
            'id' => $this->stripe_id
        ]);

        if($customer->isDeleted()) {
            $this->stripe_id = null;
            $this->save();

            return;
        }

        $subscriptions = Stripe\Subscription::all([
            'customer' => $this->stripe_id,
            'status' => 'all',
            'limit' => 100
        ]);

        foreach ($subscriptions->data as $sub) {
            if ($sub->id === $subscription_current->stripe_id) {
                $subscription_match = $sub;
            }

            if (!$subscription_active && $sub->status === 'active') {
                $subscription_active = $sub;
            }
        }

        // Matching subscription and that subscription is active on Stripe.
        // Really this is in case there happens to be more than one subscription
        // so we want to try to get the proper matching one if we can.
        if (@$subscription_match->status === 'active') {
            $subscription = $subscription_match;
        }

        // No active match but there is some active subscription on Stripe.
        // Just get the first active subscription from the array.
        elseif ($subscription_active) {
            $subscription = $subscription_active;
        }

        // If there is no active subscriptions we will try to update any
        // canceled subscriptions that might exist in the array.
        elseif (@$subscription_match->status === 'canceled') {
            $subscription = $subscription_match;
        }

        if ($subscription) {
            $ends_at = @$subscription->ended_at ?: null;

            if (!$ends_at && @$subscription->canceled_at) {
                $ends_at = @$subscription->current_period_end ?: null;
            }

            $trial_ends_at = @$subscription->trial_end ?: null;

            $data = [
                'name' => 'primary',
                'stripe_id' => $subscription->id,
                'stripe_price' => $subscription->plan->id,
                'quantity' => $subscription->quantity,
                'trial_ends_at' => $trial_ends_at ? Carbon::createFromTimestamp($trial_ends_at) : null,
                'ends_at' => $ends_at ? Carbon::createFromTimestamp($ends_at) : null
            ];

            if ($subscription_current) {
                $subscription_current->update($data);
            }
            else {
                $data['user_id'] = $this->id;

                Subscription::create($data);
            }
        }
    }
}

