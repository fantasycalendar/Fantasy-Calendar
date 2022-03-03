<?php

namespace App\Sharp;

use App\Preset;
use Code16\Sharp\EntityList\Commands\InstanceCommand;

class DeletePreset extends InstanceCommand
{
    /**
    * @return string
    */
    public function label(): string
    {
        return "Delete preset";
    }

    /**
     * @param string $instanceId
     * @param array $data
     * @return array
     */
    public function execute($instanceId, array $data = []): array
    {
        $preset = Preset::findOrFail($instanceId);
        $preset->delete();
        return $this->link('/sharp/s-list/presets');
    }
}
