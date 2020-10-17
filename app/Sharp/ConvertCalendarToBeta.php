<?php

namespace App\Sharp;

use App\Calendar;
use App\Jobs\ConvertCalendarTo2Point0;
use App\OldCalendar;
use Code16\Sharp\EntityList\Commands\InstanceCommand;

class ConvertCalendarToBeta extends InstanceCommand
{
    /**
    * @return string
    */
    public function label(): string
    {
        return "Convert calendar to beta";
    }

    /**
     * @param string $instanceId
     * @param array $data
     * @return array
     */
    public function execute($instanceId, array $data = []): array
    {
        ConvertCalendarTo2Point0::dispatchNow(OldCalendar::find($instanceId), Calendar::max('conversion_batch') + 1 ?? 1);

        return $this->reload();
    }
}
