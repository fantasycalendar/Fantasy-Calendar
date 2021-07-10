<?php


namespace App\Services\Discord\Commands\Command\Show;


use App\Services\Discord\Commands\Command;
use Illuminate\Support\Str;

class DayHandler extends Command
{

    public function handle(): string
    {
        $calendar = $this->getDefaultCalendar();

        $dayKeys = $this->dayKeys();

        $values = collect($calendar->epoch->toArray())
            ->only($dayKeys)
            ->mapWithKeys(function($value, $name) use ($dayKeys) {
                return [
                    array_search($name, $dayKeys) => ucwords(str_replace('_', ' ', Str::snake($name))) . ": " . $this->stringifyFromType($value)
                ];
            })
            ->sortKeys();

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
