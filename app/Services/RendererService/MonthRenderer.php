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
        $year_data = $this->getYearData();

        if(Arr::get($year_data, 'overflow')) {
            throw new \Exception('API rendering does not currently support overflowed weekdays.');
        }

        $month = Arr::get($year_data, "timespans.$monthID");
        $monthLength = $this->determineMonthLength($month, $monthID);

        $weekdays = collect($month['week'] ?? Arr::get($year_data, 'global_week'));

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
            'name' => $month['name'],
            'weekdays' => $weekdays,
            'structure' => $structure
        ];
    }

    private function resolveMonth()
    {
        return $this->calendar->dynamic_data['timespan'] ?? $this->calendar->dynamic_data['month'] ?? 0;
    }

    private function getYearData()
    {
        return Arr::get($this->calendar->static_data, 'year_data');
    }

    private function determineMonthLength($month, $monthKey)
    {
        $length = $month['length'];

        $leapDays = Arr::get($this->calendar->static_data, 'year_data.leap_days');

        foreach($leapDays as $day) {
            if($this->yearIntersects($day['interval'], $day['offset']) && $monthKey === $day['timespan'] && !$day['intercalary']) {
                $length++;
            }
        }
        
        return $length;
    }

    private function yearIntersects($interval, $offset)
    {
        $currentYear = Arr::get($this->calendar->dynamic_data, 'year') + $offset;

        return $currentYear % $interval == 0;
    }
}
