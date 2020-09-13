<?php

namespace App\Sharp;

use App\Calendar;
use Code16\Sharp\EntityList\Commands\InstanceCommand;

class VisitExport extends InstanceCommand
{
    /**
    * @return string
    */
    public function label(): string
    {
        return "Visit export page";
    }

    /**
     * @param string $instanceId
     * @param array $data
     * @return array
     */
    public function execute($instanceId, array $data = []): array
    {
        $calendar = Calendar::findOrFail($instanceId);

        return $this->link("/calendars/" . $calendar->hash . "/export");
    }
}
