<?php

namespace App\Sharp;

use App\User;
use Code16\Sharp\EntityList\Commands\InstanceCommand;
use Illuminate\Auth\Passwords\PasswordBroker;
use Illuminate\Support\Facades\Password;

class SendUserResetPassword extends InstanceCommand
{
    /**
    * @return string
    */
    public function label(): string
    {
        return "Send password reset email";
    }

    public function confirmationText(): string
    {
        return "Are you sure you want to send this user a password reset email?";
    }

    /**
     * @param string $instanceId
     * @param array $data
     * @return array
     */
    public function execute($instanceId, array $data = []): array
    {
        $user = User::findOrFail($instanceId);

        $broker = Password::broker();

        $broker->sendResetLink([
            'email' => $user->email
        ]);

        return $this->info("Password reset sent");
    }
}
