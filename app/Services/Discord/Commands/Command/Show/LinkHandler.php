<?php


namespace App\Services\Discord\Commands\Command\Show;


use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;

class LinkHandler extends Command
{
    use PremiumCommand;

    public static function signature(): string
    {
        return 'show link';
    }

    public function handle(): string
    {
        $calendar = $this->getDefaultCalendar();

        return "You can view '".$this->bold($calendar->name)."' here: "
            . $this->newLine()
            . route('calendars.show', $calendar);
    }
}
