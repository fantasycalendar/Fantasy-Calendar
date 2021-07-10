<?php


namespace App\Services\Discord\Commands\Command;


use App\Calendar;
use App\Services\Discord\Commands\Command;
use Illuminate\Support\Str;

class AddHandler extends Command
{

    private Calendar $calendar;

    public function handle(): string
    {
        $this->calendar = $this->getDefaultCalendar();
        $action = explode(' ', $this->called_command)[2];
        $count = $this->option(['days', 'months', 'years', 'minutes', 'hours']) ?? 1;

        $this->$action($count);

        $response = ($count)
            ? Str::plural($action, $count)
            : '1 ' . $action;

        return $response . " added!" . $this->newLine(2) . "The new date is:" . $this->newLine() . $this->blockQuote($this->calendar->current_date);
    }

    public function __call($name, $arguments)
    {
        $method = 'add' . ucfirst($name) . 's';

        $this->calendar
            ->$method($arguments[0])
            ->save();
    }
}
