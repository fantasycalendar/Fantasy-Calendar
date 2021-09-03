<?php

namespace App\Services\Discord\Commands\Command\Traits;

trait PremiumCommand
{
    public function authorize(): bool
    {
        return $this->user->isPremium();
    }

    public function unauthorized_message(): string
    {
        return "Fantasy Calendar's Discord integration is available to subscribers!\n\n You can become one here: " . route('subscription.pricing');
    }
}
