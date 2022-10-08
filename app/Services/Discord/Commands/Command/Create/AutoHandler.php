<?php

namespace App\Services\Discord\Commands\Command\Create;

use App\Jobs\HitCalendarUpdateWebhook;
use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;
use App\Services\Discord\Exceptions\DiscordCalendarLinkedException;
use Illuminate\Support\Str;

class AutoHandler extends Command
{
    use PremiumCommand;

    public static function signature(): string
    {
        return "auto";
    }

    public function authorize(): bool
    {
        $calendar = $this->getDefaultCalendar();

        if($calendar->isChild()) {
            throw new DiscordCalendarLinkedException($calendar);
        }

        return $this->user->isPremium();
    }

    public function handle()
    {
        $action = explode(' ',$this->called_command)[2];

        logger()->debug($action);

        return $this->$action();
    }

    public function enable()
    {
        $calendar = $this->getDefaultCalendar();

        if($calendar->advancement_enabled) {
            return Command\Response::make(
                sprintf(
                    "**%s** is already set to auto-advance at a rate of %s in-universe %s per every %s real-world %s.",
                    $calendar->name,
                    $calendar->advancement_rate,
                    Str::of($calendar->advancement_rate_unit)
                        ->singular()
                        ->plural($calendar->advancement_rate),
                    $calendar->advancement_real_rate,
                    Str::of($calendar->advancement_real_rate_unit)
                        ->singular()
                        ->plural($calendar->advancement_real_rate),
                )
            )->ephemeral();
        }

        $calendar->ensureAdvancmentIsInitialized();

        $calendar->update([
            'advancement_enabled' => 1,
        ]);

        return Command\Response::make(
                sprintf(
                    "**%s** is now set to auto-advance, and will move forward in real-time at a rate of %s in-universe %s per every %s real-world %s. You can change these values from the calendar edit page.",
                    $calendar->name,
                    $calendar->advancement_rate,
                    Str::of($calendar->advancement_rate_unit)
                        ->singular()
                        ->plural($calendar->advancement_rate),
                    $calendar->advancement_real_rate,
                    Str::of($calendar->advancement_real_rate_unit)
                        ->singular()
                        ->plural($calendar->advancement_real_rate),
                )
            )->addRow(function(ActionRow $row) use ($calendar) {
                return $row->addButton(route('discord.webhookRedirect', [
                    'calendarHash' => $calendar->hash
                ]), 'Setup a webhook for a real-time message!');
            })
            ->ephemeral();
    }

    public function disable()
    {
        $calendar = $this->getDefaultCalendar();

        if(!$calendar->advancement_enabled) {
            return Command\Response::make(sprintf("Auto-advancement is already disabled on **%s**.", $calendar->name))->ephemeral();
        }

        $calendar->update([
            'advancement_enabled' => 0
        ]);

        HitCalendarUpdateWebhook::dispatch($calendar, "Auto-advancement disabled.");

        return Command\Response::make(
            sprintf(
                "Auto-advancement disabled, **%s** will no longer auto-advance.",
                $calendar->name
            )
        )->ephemeral();
    }
}
