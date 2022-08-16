<?php

namespace App\Services\Discord\Commands\Command\Create;

use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;

class AutoHandler extends Command
{
    use PremiumCommand;

    public static function signature(): string
    {
        return "auto";
    }

    public function handle()
    {
        $action = explode(' ',$this->called_command)[2];

        logger()->debug($action);

        return $this->$action();
//        return "Would have tried to $action stuff here";
    }

    public function enable()
    {
        $calendar = $this->getDefaultCalendar();

        $calendar->ensureAdvancmentIsInitialized();

        $calendar->update([
            'advancement_enabled' => 1,
        ]);

        return Command\Response::make("Your calendar is now set to auto-advance. To get automatic updates in a channel when time advances");
    }
}
