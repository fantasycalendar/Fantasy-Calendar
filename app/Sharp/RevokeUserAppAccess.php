<?php

namespace App\Sharp;

use App\User;
use Code16\Sharp\EntityList\Commands\InstanceCommand;

class RevokeUserAppAccess extends InstanceCommand
{
    /**
     * @return string
     */
    public function label(): string
    {
        return "Revoke user app access";
    }

    public function authorizeFor($instanceId): bool
    {
        return User::findOrFail($instanceId)->migrated == 1;
    }

    public function confirmationText()
    {
        return "Are you sure you want to revoke this user's app access?";
    }

    /**
     * @param string $instanceId
     * @param array $data
     * @return array
     */
    public function execute($instanceId, array $data = []): array
    {
        $user = User::findOrFail($instanceId);
        $user->migrated = 0;
        $user->save();

        $user->calendars->whereNotNull('conversion_batch')->each->delete();

        return $this->reload();
    }
}
