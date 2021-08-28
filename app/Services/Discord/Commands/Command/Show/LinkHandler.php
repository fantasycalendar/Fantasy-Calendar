<?php


namespace App\Services\Discord\Commands\Command\Show;


use App\Services\Discord\Commands\Command;

class LinkHandler extends Command
{

    public function handle(): string
    {
        $calendar = $this->getDefaultCalendar();

        return "You can view '".$this->bold($calendar->name)."' here: "
            . $this->newLine()
            . route('calendar.show', $calendar);
    }
}
