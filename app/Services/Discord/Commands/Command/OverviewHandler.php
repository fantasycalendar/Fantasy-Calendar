<?php

namespace App\Services\Discord\Commands\Command;

use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;
use App\Services\Discord\Exceptions\DiscordException;

class OverviewHandler extends \App\Services\Discord\Commands\Command
{
    use PremiumCommand;

    public int $width;

    /**
     * @inheritDoc
     */
    public function handle()
    {
        $calendar = $this->getDefaultCalendar();
        $dateString = sprintf("%s, %s", $calendar->epoch->weekdayName, $calendar->current_date);
        $this->width = strlen($dateString);

        $response = $this->heading($calendar->name, $this->width);
        $response .= $this->newLine();
        $response .= $dateString;
        $response .= $this->getEvents($calendar);

        return $this->codeBlock($response);
    }

    public function getEvents($calendar)
    {
        $events = $calendar
            ->todaysOneTimeEvents
            ->reject->setting('hide')
            ->reject->setting('hide_full');

        if(!$events->count()) {
            return '';
        }

        // TODO: Give this more categories once we can do more than just one-time events.
        // ... Or something.
        return $this->newLine(2)
             . $this->heading('One-time events', $this->width)
             . $this->newLine()
             . $events->map->name->join($this->newLine());
    }

    /**
     * @inheritDoc
     */
    public static function signature(): string
    {
        return 'overview';
    }
}
