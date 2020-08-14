<?php

namespace App\Sharp;

use App\User;
use Carbon\Carbon;
use Code16\Sharp\EntityList\Commands\InstanceCommand;
use Str;

class GiveUserBetaAccess extends InstanceCommand
{
    /**
    * @return string
    */
    public function label(): string
    {
        return "Give user beta access";
    }

    public function authorizeFor($instanceId): bool
    {
        return User::findOrFail($instanceId)->beta_authorised == 0;
    }

    public function confirmationText()
    {
        return "Are you sure you want to give this user beta access?";
    }

    /**
     * @param string $instanceId
     * @param array $data
     * @return array
     */
    public function execute($instanceId, array $data = []): array
    {
        $user = User::findOrFail($instanceId);
        $user->beta_authorised = 1;

        if($user->email_verified_at == null) {
            $user->email_verified_at = Carbon::now();
        }

        if($user->api_token == null) {
            $user->api_token = Str::random(60);
        }

        $user->save();

        return $this->reload();
    }
}
