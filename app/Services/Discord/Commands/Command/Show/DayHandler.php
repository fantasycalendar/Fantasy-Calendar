<?php


namespace App\Services\Discord\Commands\Command\Show;


use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;
use Illuminate\Support\Str;

class DayHandler extends Command
{
    use PremiumCommand;

    public static function signature(): string
    {
        return 'show day';
    }

    public function handle(): string
    {
        $calendar = $this->getDefaultCalendar();

        $labelLength = 0;
        $values = collect($calendar->epoch->toArray())
            ->only($this->dayKeys())
            ->mapWithKeys(function($value, $name){
                return [
                    ucfirst(str_replace('_', ' ', Str::snake($name))) => $this->stringifyFromType($value)
                ];
            })
            ->tap(function($infobits) use (&$labelLength){
                $labelLength = $infobits->keys()->max(function($key){
                    return strlen($key);
                });
            })
            ->map(function($value, $name) use ($labelLength){
                return Str::padLeft($name, $labelLength + 1, ' ') . " : " . $value;
            });

        $heading = "Today is " . $this->bold($calendar->current_date) . "." . $this->newLine() . "Here are some stats for nerds about this day:";

        return $this->blockQuote($heading) . $this->newLine() . $this->codeBlock($values->join($this->newLine()));
    }

    private function stringifyFromType($value)
    {
        switch (gettype($value)) {
            case 'boolean':
                return ($value) ? "Yes" : "No";
            case 'array':
                return collect($value)->map(function($item, $key) { return $key . ": " . $this->stringifyFromType($item); });
            default:
                return $value;
        }
    }

    private function dayKeys()
    {
        return [
            'epoch',
            'year',
            'month',
            'day',
            'weekdayName',
            'monthIndexOfYear',
            'dayOfYear',
            'historicalIntercalaryCount',
            'monthId',
            'weekdayIndex',
            'weeksSinceMonthStart',
            'weeksTilMonthEnd',
            'weeksSinceYearStart',
            'weeksTilYearEnd',
            'isIntercalary',
            'isNumbered',
        ];
    }
}
