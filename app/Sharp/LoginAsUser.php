<?php

namespace App\Sharp;

use App\User;
use Auth;
use Code16\Sharp\EntityList\Commands\InstanceCommand;

class LoginAsUser extends InstanceCommand
{
    /**
    * @return string
    */
    public function label(): string
    {
        return "Login as user";
    }

    public function authorizeFor($instanceId): bool
    {
        return User::findOrFail($instanceId)->agreed_at !== null;
    }

    /**
     * @param string $instanceId
     * @param array $data
     * @return array
     */
    public function execute($instanceId, array $data = []): array
    {
        return $this->link("/admin/loginas/" . $instanceId);
    }
}
