<?php


namespace App\Services\Discord\Commands\Command\Show;


use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;

class EraHandler extends Command
{
    use PremiumCommand;

    public function handle(): string
    {
        return $this->blockQuote("Current era:\n" . $this->bold($this->getDefaultCalendar()->current_era));
    }
}
