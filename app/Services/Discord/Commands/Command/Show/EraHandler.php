<?php


namespace App\Services\Discord\Commands\Command\Show;


use App\Services\Discord\Commands\Command;

class EraHandler extends Command
{

    public function handle(): string
    {
        return $this->blockQuote("Current era:\n" . $this->bold($this->getDefaultCalendar()->current_era));
    }
}
