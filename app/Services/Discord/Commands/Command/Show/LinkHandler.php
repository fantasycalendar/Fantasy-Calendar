<?php


namespace App\Services\Discord\Commands\Command\Show;


use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;

class LinkHandler extends Command
{
    use PremiumCommand;

    public static function signature(): string
    {
        return 'show link';
    }

    public function handle()
    {
        $calendar = $this->getDefaultCalendar();

        return Response::make("Check out " . $this->mention() . "'s calendar " . $this->bold($calendar->name) . " on ".config('app.name') . ":")
            ->singleButton(route('calendars.show', $calendar), $calendar->name);
    }
}
