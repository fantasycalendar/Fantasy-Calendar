<?php


namespace App\Services\Discord\Commands\Command;


use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;

class ListHandler extends Command
{
    use PremiumCommand;

    public function handle(): string
    {
        $this->response = $this->mention() . "'s calendars:\n";

        $this->response .= $this->listCalendars();

        if($this->setting('default_calendar')) {
            $this->response .= sprintf("\nYour default calendar in this server is **%s**.", $this->getDefaultCalendar()->name);
        }

        return $this->response;
    }
}
