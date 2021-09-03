<?php


namespace App\Services\Discord\Commands\Command\Show;


use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;

class DateHandler extends Command
{
    use PremiumCommand;

    public function handle(): string
    {
        $calendar = $this->getDefaultCalendar();

        $response = $this->heading($calendar->name, strlen($calendar->current_date));
        $response .= $this->newLine(2);
        $response .= $calendar->current_date;

        return $this->codeBlock($response);
    }
}
