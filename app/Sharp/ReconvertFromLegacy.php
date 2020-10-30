<?php

namespace App\Sharp;

use App\Calendar;
use App\Jobs\ConvertCalendarTo2Point0;
use App\OldCalendar;
use Code16\Sharp\EntityList\Commands\InstanceCommand;

class ReconvertFromLegacy extends InstanceCommand
{
    public function authorizeFor($instanceId): bool
    {
        return OldCalendar::where('hash', Calendar::find($instanceId)->hash)->exists();
    }

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
        ConvertCalendarTo2Point0::dispatchNow(OldCalendar::where('hash', Calendar::find($instanceId)->hash)->firstOrFail(), Calendar::max('conversion_batch') + 1 ?? 1);

        return $this->reload();
    }
}
