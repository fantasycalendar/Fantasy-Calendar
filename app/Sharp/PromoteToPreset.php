<?php

namespace App\Sharp;

use Code16\Sharp\EntityList\Commands\InstanceCommand;

use App\Models\Calendar;
use App\Jobs\ConvertCalendarToPreset;

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
        $results = ConvertCalendarToPreset::dispatchNow(Calendar::find($instanceId));

        return $this->link('/sharp/s-list/presets/s-show/presets/' . $results->id . '/s-form/presets/' . $results->id);
    }
}
