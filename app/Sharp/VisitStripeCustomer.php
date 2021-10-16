<?php

namespace App\Sharp;

use App\User;
use Code16\Sharp\EntityList\Commands\InstanceCommand;

class VisitStripeCustomer extends InstanceCommand
{
    /**
    * @return string
    */
    public function label(): string
    {
        return "View customer on Stripe";
    }

    public function authorizeFor($instanceId): bool
    {
        return User::findOrFail($instanceId)->stripe_id !== null;
    }

    /**
     * @param string $instanceId
     * @param array $data
     * @return array
     */
    public function execute($instanceId, array $data = []): array
    {
        $customerId = User::find($instanceId)->stripe_id;

        return $this->link("https://dashboard.stripe.com/customers/" . $customerId);
    }
}
