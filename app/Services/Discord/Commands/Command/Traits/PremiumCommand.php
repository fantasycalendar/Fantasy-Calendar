<?php

namespace App\Services\Discord\Commands\Command\Traits;

use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Exceptions\DiscordUserUnauthorized;

trait PremiumCommand
{
    public function authorize(): bool
    {
        return $this->user->isPremium();
    }

    public function unauthorized(): void
    {
        $response = Response::make("Fantasy Calendar's Discord integration is available to subscribers!")
            ->singleButton(route('subscription.pricing'), 'Become a Subscriber Now')
            ->ephemeral();

        throw new DiscordUserUnauthorized($response);
    }
}
