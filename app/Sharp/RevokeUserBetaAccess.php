<?php

namespace App\Sharp;

use App\User;
use Code16\Sharp\EntityList\Commands\InstanceCommand;

class RevokeUserBetaAccess extends InstanceCommand
{
    /**
     * @return string
     */
    public function label(): string
    {
        return "Revoke user beta access";
    }

    public function authorizeFor($instanceId): bool
    {
        return User::findOrFail($instanceId)->beta_authorised == 1;
    }

    public function confirmationText()
    {
        return "Are you sure you want to revoke this user's access?";
    }

    /**
     * @param string $instanceId
     * @param array $data
     * @return array
     */
    public function execute($instanceId, array $data = []): array
    {
        $user = User::findOrFail($instanceId);
        $user->beta_authorised = 0;
        $user->save();

        return $this->reload();
    }
}
