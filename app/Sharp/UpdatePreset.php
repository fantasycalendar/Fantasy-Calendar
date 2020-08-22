<?php

namespace App\Sharp;

use App\Preset;
use App\Jobs\UpdateCalendarPreset;
use Code16\Sharp\EntityList\Commands\InstanceCommand;

class UpdatePreset extends InstanceCommand
{
    /**
    * @return string
    */
    public function label(): string
    {
        return "Update preset";
    }

    /**
     * @param string $instanceId
     * @param array $data
     * @return array
     */
    public function execute($instanceId, array $data = []): array
    {
        $results = UpdateCalendarPreset::dispatchNow(Preset::find($instanceId));
        
        return $this->link('/sharp/show/presets/' . $results->id);

    }
}
