<?php


namespace App\Services\Discord\Commands\Command\Show;


use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;

class DateHandler extends Command
{
    use PremiumCommand;

    public static function signature(): string
    {
        return 'show date';
    }

    public function handle(): string
    {
        $calendar = $this->getDefaultCalendar();

        $dateString = sprintf("%s, %s", $calendar->epoch->weekdayName, $calendar->current_date);

        $response = $this->heading($calendar->name, strlen($dateString));
        $response .= $this->newLine(2);
        $response .= $dateString;
        $response .= $this->newLine(1);

        return $this->codeBlock($response);
    }
}
