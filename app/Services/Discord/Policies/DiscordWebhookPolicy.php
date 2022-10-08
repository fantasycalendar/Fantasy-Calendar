<?php

namespace App\Services\Discord\Policies;

use App\Models\User;
use App\Services\Discord\Models\DiscordWebhook;
use Illuminate\Auth\Access\HandlesAuthorization;

class DiscordWebhookPolicy
{
    use HandlesAuthorization;

    public function update(User $user, DiscordWebhook $webhook)
    {
        return $user->id === $webhook->user_id;
    }

    public function delete(User $user, DiscordWebhook $webhook)
    {
        return $user->id === $webhook->user_id;
    }
}
