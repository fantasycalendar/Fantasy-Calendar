<?php


namespace App\Services\RendererService;


use App\Calendar;
use App\Services\DatePipeline\AddCurrentDate;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Arr;

class MonthRenderer
{
    /**
     * @var Calendar
     */
    private Calendar $calendar;
    private array $pipeline = [
        AddCurrentDate::class
    ];

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

        $pipelineData = [
            'render_data' => $month,
            'calendar' => $this->calendar
        ];

        return (new Pipeline(app()))
                    ->send($pipelineData)
                    ->through($this->pipeline)
                    ->then($this->verifyData());
    }

    private function verifyData()
    {
        return function ($data) {
            return $data;
        };
    }

    private function buildMonth($monthID)
    {
        $weekdays = collect($this->getMonth()['week'] ?? Arr::get($this->getYearData(), 'global_week'));
        $weeksInMonth = collect(range(1, (int) (ceil($this->determineMonthLength() / $weekdays->count()))));

        $monthDay = 0;
        $structure = $weeksInMonth->mapWithKeys(function($weekNumber) use (&$monthDay, $weekdays){
            return [
                $weekNumber => $weekdays->map(function($day) use (&$monthDay){
                    $monthDay++;

                    return $this->dayInfo((($monthDay > $this->determineMonthLength()) ? null : $monthDay), $day);
                })
            ];
        });

        return [
            'year' => $this->getYear(),
            'name' => $this->getMonth()['name'],
            'weekdays' => $weekdays,
            'weeks' => $structure
        ];
    }

    private function dayInfo($dayToCheck, $name)
    {
        $day = $this->getDay();

        return [
            'name' => $name,
            'month_day' => $dayToCheck,
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
