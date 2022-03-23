<?php

namespace App\Sharp;

use App\Models\User;
use Carbon\Carbon;
use Code16\Sharp\EntityList\Commands\InstanceCommand;

class ForceVerifyUserEmail extends InstanceCommand
{
    /**
     * @return string
     */
    public function label(): string
    {
        return "Force Verify Email";
    }

    public function confirmationText(): string
    {
        return "Are you sure you want to forcibly verify this user's email?";
    }

    /**
     * @param string $instanceId
     * @param array $data
     * @return array
     */
    public function execute($instanceId, array $data = []): array
    {
        User::whereId($instanceId)->update([
            'email_verified_at' => now();
        ]);

        return $this->info("Email successfully verified");
    }
}
