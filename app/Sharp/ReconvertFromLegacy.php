<?php

namespace App\Sharp;

use Code16\Sharp\EntityList\Commands\InstanceCommand;

class ReconvertFromLegacy extends InstanceCommand
{
    /**
    * @return string
    */
    public function label(): string
    {
        return "Reconvert from 1.0 to 2.0";
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
