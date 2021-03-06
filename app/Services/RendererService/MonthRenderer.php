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

        if(Arr::get($this->getYearData(), 'overflow')) {
            throw new \Exception('API rendering does not currently support overflowed weekdays.');
        }
    }

    public function render()
    {
        $month = $this->buildMonth($this->resolveMonth());

        return $month;
    }

    private function buildMonth($monthID)
    {
        $weekdays = collect($this->getMonth()['week'] ?? Arr::get($this->getYearData(), 'global_week'));
        $weeksInMonth = collect(range(1, (int) (ceil($this->determineMonthLength() / $weekdays->count()))));

        $monthDay = 0;
        $structure = $weeksInMonth->mapWithKeys(function($weekNumber) use (&$monthDay, $weekdays){
            return [
                $weekNumber => $weekdays->mapWithKeys(function($day) use (&$monthDay){
                    $monthDay++;

                    $dayInfo = $this->dayInfo((($monthDay > $this->determineMonthLength()) ? null : $monthDay), $day);

                    return [ $day => $dayInfo ];
                })
            ];
        });

        return [
            'year' => $this->getYear(),
            'name' => $this->getMonth()['name'],
            'weekdays' => $weekdays,
            'structure' => $structure
        ];
    }

    private function dayInfo($dayToCheck, $name)
    {
        $day = $this->getDay();

        return [
            'name' => $name,
            'month_day' => $dayToCheck,
            'current' => ($day == $dayToCheck)
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

    private function getYear()
    {
        return Arr::get($this->calendar->dynamic_data, 'year');
    }

    private function getMonth()
    {
        return Arr::get($this->getYearData(), "timespans." . $this->resolveMonth());
    }

    private function getDay()
    {
        return Arr::get($this->calendar->dynamic_data, 'day');
    }

    private function determineMonthLength()
    {
        $length = $this->getMonth()['length'];

        $leapDays = Arr::get($this->calendar->static_data, 'year_data.leap_days');

        foreach($leapDays as $day) {
            if($this->yearIntersects($day['interval'], $day['offset']) && $this->resolveMonth() === $day['timespan'] && !$day['intercalary']) {
                $length++;
            }
        }

        return $length;
    }

    private function yearIntersects($interval, $offset)
    {
        $currentYear = $this->getYear() + $offset;

        return $currentYear % $interval == 0;
    }
}
