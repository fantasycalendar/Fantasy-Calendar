<?php


namespace App\Services\RendererService;


use App\Calendar;
use App\Services\DatePipeline\AddDayType;
use App\Services\DatePipeline\AddIsCurrentDate;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Arr;

class MonthRenderer
{
    /**
     * @var Calendar
     */
    private Calendar $calendar;
    private array $pipeline = [
        AddIsCurrentDate::class,
        AddDayType::class,
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

    /**
     * @param mixed $date The date you want to render (default is current) - array [year, month, day]
     * @return mixed
     */
    public function render($date = null)
    {
        if($date) {
            $this->calendar->setDate($date[0], $date[1], $date[2]);
        }

        $month = $this->buildMonth();

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
            return $data['render_data'];
        };
    }

    private function buildMonth()
    {
        $weekdays = collect($this->calendar->month['week'] ?? Arr::get($this->getYearData(), 'global_week'));
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
            'year' => $this->calendar->year,
            'name' => $this->calendar->month_name,
            'weekdays' => $weekdays,
            'weeks' => $structure
        ];
    }

    private function dayInfo($dayToCheck, $name)
    {
        $day = $this->getDay();

        return [
            'name' => $dayToCheck ? $name : null,
            'month_day' => $dayToCheck,
        ];
    }

    private function getYearData()
    {
        return Arr::get($this->calendar->static_data, 'year_data');
    }

    private function getDay()
    {
        return Arr::get($this->calendar->dynamic_data, 'day');
    }

    private function determineMonthLength()
    {
        $length = $this->calendar->month_length;

        $leapDays = Arr::get($this->calendar->static_data, 'year_data.leap_days');

        foreach($leapDays as $day) {
            if($this->yearIntersectsLeapDay($day['interval'], $day['offset']) && $this->calendar->month_id === $day['timespan'] && !$day['intercalary']) {
                $length++;
            }
        }

        return $length;
    }

    private function yearIntersectsLeapDay($interval, $offset)
    {
        $currentYear = $this->calendar->year + $offset;

        return $currentYear % $interval == 0;
    }
}
