<?php


namespace App\Services\RendererService;


use App\Calendar;
use App\Services\DatePipeline\AddDayName;
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
        AddDayName::class,
    ];

    /**
     * YearRenderer constructor.
     * @param Calendar $calendar
     */
    public function __construct(Calendar $calendar)
    {
        $this->calendar = $calendar;

        if($this->calendar->overflows_week) {
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
        $weeksInMonth = $this->buildWeekList();

        $monthDay = 0;
        $structure = $weeksInMonth->mapWithKeys(function($weekNumber) use (&$monthDay){
            return [
                $weekNumber => collect($this->calendar->month_week)->map(function($day) use (&$monthDay){
                    $monthDay++;

                    return ['month_day' => $monthDay > $this->calendar->month_length ? null : $monthDay];
                })
            ];
        });

        return [
            'year' => $this->calendar->year,
            'name' => $this->calendar->month_name,
            'length' => $this->calendar->month_true_length,
            'weekdays' => $this->calendar->month_week,
            'weeks' => $structure
        ];
    }

    private function buildWeekList()
    {
        $weeks_in_month = ceil($this->calendar->month_length / count($this->calendar->month_week));

        return collect(
            range(1, $weeks_in_month)
        );
    }
}
