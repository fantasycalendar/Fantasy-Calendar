<?php


namespace App\Services\Discord\Commands\Command;


use App\Services\Discord\Commands\Command;

class ListHandler extends Command
{
    public function handle(): string
    {
        $this->response = $this->mention() . "'s calendars:\n";

        $this->response .= $this->listCalendars();

        return $this->response;
    }
}
