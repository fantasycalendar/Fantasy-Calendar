<?php


namespace App\Services\Discord\Commands\Command;


use App\Services\Discord\Commands\Command;

class ListHandler extends Command
{
    public function handle(): string
    {
        $this->response = $this->mention() . "'s calendars:\n";

        $this->user->calendars->each(function($calendar){
            $this->blockQuote($calendar->name);
        });

        return $this->response;
    }
}
