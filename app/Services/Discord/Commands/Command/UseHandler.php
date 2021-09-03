<?php


namespace App\Services\Discord\Commands\Command;


use App\Calendar;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;
use Illuminate\Support\Arr;

class UseHandler extends \App\Services\Discord\Commands\Command
{
    use PremiumCommand;

    public function handle(): string
    {
        $argument = $this->option('id');

        $default = $this->user->calendars()
            ->orderBy('name')
            ->get()
            ->mapWithKeys(function($calendar, $index){
                return [$index => $calendar];
            })
            ->get($argument);

        if(is_null($default)) {
            return sprintf("No calendar matched %s. Your options are:\n%s", $argument, $this->listCalendars());
        }

        $this->setting('default_calendar', $default->id);

        return sprintf("Your default calendar for this server set to choice %s: **%s**", $argument, $default->name);
    }
}
