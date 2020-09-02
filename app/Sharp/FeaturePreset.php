<?php

namespace App\Sharp;

use App\Preset;
use Code16\Sharp\EntityList\Commands\InstanceCommand;

class FeaturePreset extends InstanceCommand
{
    /**
    * @return string
    */
    public function label(): string
    {
        return "Make featured";
    }

    /**
     * @param string $instanceId
     * @param array $data
     * @return array
     */
    public function execute($instanceId, array $data = []): array
    {

        Preset::findOrFail($instanceId)->feature();

        return $this->link('/sharp/list/presets');
    }
}
