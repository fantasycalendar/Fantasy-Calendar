<?php

namespace App\Sharp;

use Code16\Sharp\EntityList\Commands\InstanceCommand;

class PromoteToPreset extends InstanceCommand
{
    /**
    * @return string
    */
    public function label(): string
    {
        return "Promote to preset";
    }

    /**
     * @param string $instanceId
     * @param array $data
     * @return array
     */
    public function execute($instanceId, array $data = []): array
    {
        //
    }
}
