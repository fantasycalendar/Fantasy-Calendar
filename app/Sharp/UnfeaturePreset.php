<?php

namespace App\Sharp;

use App\Models\Preset;
use Code16\Sharp\EntityList\Commands\InstanceCommand;

class UnfeaturePreset extends InstanceCommand
{
    /**
    * @return string
    */
    public function label(): string
    {
        return "Unfeature";
    }

    /**
     * @param string $instanceId
     * @param array $data
     * @return array
     */
    public function execute($instanceId, array $data = []): array
    {

        Preset::findOrFail($instanceId)->unFeature();

        return $this->link('/sharp/s-list/presets');
    }
}
