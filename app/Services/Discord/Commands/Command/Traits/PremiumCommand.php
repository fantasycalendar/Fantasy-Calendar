<?php

namespace App\Services\Discord\Commands\Command\Traits;

use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Exceptions\DiscordUserInvalidException;
use App\Services\Discord\Exceptions\DiscordUserUnauthorized;

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
