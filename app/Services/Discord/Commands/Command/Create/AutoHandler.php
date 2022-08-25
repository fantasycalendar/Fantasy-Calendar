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

        return Command\Response::make(
                sprintf(
                    "Your calendar is now set to auto-advance, and will move forward in real-time at a rate of %s %s %s per every %s %s in the real-world. You can change these values from the calendar edit page.",
                    $calendar->advancement_rate,
                    $calendar->name,
                    $calendar->advancement_rate_unit,
                    $calendar->advancement_real_rate,
                    $calendar->advancement_real_rate_unit,
                )
            )->addRow(function(ActionRow $row) use ($calendar) {
                return $row->addButton(route('discord.webhookRedirect', [
                    'calendarHash' => $calendar->hash
                ]), 'Setup a webhook for a real-time message!');
            });
    }
}
