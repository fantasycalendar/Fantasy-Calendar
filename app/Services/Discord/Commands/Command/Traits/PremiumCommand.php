<?php

namespace App\Services\Discord\Commands\Command\Traits;

use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Exceptions\DiscordUserInvalidException;

/**
 * Provides a basic implementation of making a command premium-user-only
 */
trait PremiumCommand
{
    public function authorize(): bool
    {
        return $this->user->isPremium();
    }

    public function unauthorized(): void
    {
        throw new DiscordUserInvalidException();
    }
}
