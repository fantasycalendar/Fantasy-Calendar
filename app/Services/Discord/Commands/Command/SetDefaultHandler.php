<?php


namespace App\Services\Discord\Commands\Command;


use App\Calendar;
use Illuminate\Support\Arr;

class SetDefaultHandler extends \App\Services\Discord\Commands\Command
{

    public function handle(): string
    {
        $argument = $this->interaction( 'data.options.0.options.0.value');

        $default = $this->user->calendars()->orderBy('name')->get()->mapWithKeys(function($calendar, $index){
            return [$index => $calendar];
        })->get($argument);

        if(is_null($default)) {
            return sprintf("No calendar matched %s. Your options are:\n%s", $argument, $this->listCalendars());
        }

        $this->setting('default_calendar', $default->id);

        return sprintf("Your default calendar for this server set to choice %s: **%s**", $argument, $default->name);
    }
}
