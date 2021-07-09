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
        $count = $this->option(['days', 'months', 'years', 'minutes', 'hours']);

        if(method_exists($this, $action)) {
            $this->$action();

            $response = ($count)
                ? Str::plural($action, $count)
                : '1 ' . $action;

            return $response . " added!" . $this->newLine(2) . "The new date is:" . $this->newLine() . $this->blockQuote($this->calendar->current_date);
        }

        return 'Sorry bub, dunno how to do that yet.';
    }

    public function day()
    {
        $this->calendar->addDay()->save();
    }
}
