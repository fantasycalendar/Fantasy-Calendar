<?php


namespace App\Services\RendererService;


use App\Calendar;
use Illuminate\Support\Arr;

class MonthRenderer
{
    /**
     * @var Calendar
     */
    private Calendar $calendar;

    /**
     * YearRenderer constructor.
     * @param Calendar $calendar
     */
    public function __construct(Calendar $calendar)
    {
        $this->calendar = $calendar;
    }

    public function render()
    {
        $month = $this->buildMonth($this->resolveMonth());

        return $month;
    }

    private function buildMonth($monthID)
    {
        $year_data = Arr::get($this->calendar->static_data, 'year_data');

        if(Arr::get($year_data, 'overflow')) {
            throw new \Exception('API rendering does not currently support overflowed weekdays.');
        }

        $month = Arr::get($year_data, "timespans.$monthID");

        $name = $month['name'];
        $weekdays = collect($month['week'] ?? Arr::get($year_data, 'global_week'));
        $monthLength = $month['length'];

        $weeksInMonth = collect(range(1, (int) (ceil($monthLength / $weekdays->count()))));

        $monthDay = 0;
        $structure = $weeksInMonth->mapWithKeys(function($weekNumber) use (&$monthDay, $weekdays, $monthLength){
            return [
                $weekNumber => $weekdays->mapWithKeys(function($day) use (&$monthDay, $monthLength){
                    $monthDay++;

                    return [ $day => ($monthDay > $monthLength) ? null : $monthDay ];
                })
            ];
        });

        return [
            'name' => $name,
            'weekdays' => $weekdays,
            'structure' => $structure
        ];
    }

    private function resolveMonth()
    {
        return $this->calendar->dynamic_data['timespan'] ?? $this->calendar->dynamic_data['month'] ?? 0;
    }
}
