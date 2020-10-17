<?php

namespace App\Sharp;

use App\Calendar;
use App\Jobs\ConvertCalendarTo2Point0;
use App\OldCalendar;
use App\User;
use Carbon\Carbon;
use Code16\Sharp\EntityList\Commands\InstanceCommand;
use Str;

class GiveUserAppAccess extends InstanceCommand
{
    /**
    * @return string
    */
    public function label(): string
    {
        return "Give user app access";
    }

    public function authorizeFor($instanceId): bool
    {
        return User::findOrFail($instanceId)->migrated == 0;
    }

    public function confirmationText()
    {
        return "Are you sure you want to give this user app access?";
    }

    /**
     * @param string $instanceId
     * @param array $data
     * @return array
     */
    public function execute($instanceId, array $data = []): array
    {
        $user = User::findOrFail($instanceId);
        $user->migrated = 1;

        if($user->api_token == null) {
            $user->api_token = Str::random(60);
        }

        $user->save();

        foreach(OldCalendar::where('user_id', $user->id)->where('deleted', 0)->get() as $calendar) {
            ConvertCalendarTo2Point0::dispatch($calendar, Calendar::max('conversion_batch') + 1 ?? 1);
        }

        return $this->link("/sharp/show/user/" . $instanceId);
    }
}
