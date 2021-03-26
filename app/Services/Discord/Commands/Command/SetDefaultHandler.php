<?php


namespace App\Services\Discord\Commands\Command;


use Illuminate\Support\Arr;

class SetDefaultHandler extends \App\Services\Discord\Commands\Command
{

    public function handle(): string
    {
        $argument = Arr::get($this->interaction_data, 'data.options.0.options.0.value');

        $calendarHashes = $this->user->calendars->orderBy('name')->mapWithKeys(function($calendar, $index){
            return [$index => $calendar->hash];
        });

        $default = Arr::get($calendarHashes, $argument);

        if(!$default) {
            return sprintf("No calendar matched %s. Your options are:\n\n%s", $argument, $this->getCalendarList());
        }


    }

    private function getCalendarList()
    {
        return "```" . $this->user->calendars->map(function($calendar, $index) {
            return $index . ": " . $calendar->name . "\n";
        }) . "```";
    }
}
