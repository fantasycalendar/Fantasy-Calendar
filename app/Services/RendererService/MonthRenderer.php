<?php


namespace App\Services\RendererService;


use App\Calendar;
use App\Services\CalendarService\LeapDay;
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

        $pipelineData = [
            'render_data' => $this->buildMonth(),
            'calendar' => $this->calendar
        ];

        return (new Pipeline(app()))
                    ->send($pipelineData)
                    ->through($this->pipeline)
                    ->then($this->verifyData());
    }

    /**
     * Returns a closure used when verifying our render data
     * Currently it just returns. Should probably actually
     * verify the data we pass through it at some point.
     * @return \Closure
     */
    private function verifyData()
    {
        return function ($data) {
            return $data['render_data'];
        };
    }

    /**
     * Builds the structure of our month, populating it only with the day of the month
     * Since we're building the data used for visually rendering a calendar, we must
     * include days that are not actually fully calendar dates. Each pipeline job
     * should only act on the days that have null "month_day" values if needed
     *
     * @return array
     */
    private function buildMonth()
    {
        $weeksInMonth = $this->buildWeekList();

        $monthDay = 0;
        $structure = $weeksInMonth->mapWithKeys(function($weekNumber) use (&$monthDay){
            return [
                $weekNumber => collect($this->calendar->month_week)->map(function($day) use (&$monthDay){
                    $monthDay++;

                    return ['month_day' => ($monthDay > $this->calendar->month_true_length) ? null : $monthDay];
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

    /**
     * Creates a collection of weeks for use in displaying this month
     * It doesn't add any days or anything, just a collection that
     * contains an integer of each week that is within a month.
     * Example: A month with 30 days and 10-day is built as:
     *
     * collect([1, 2, 3]);
     *
     * @return \Illuminate\Support\Collection
     */
    private function buildWeekList()
    {
        $weeks_in_month = ceil($this->calendar->month_length / count($this->calendar->month_week));

        return collect(
            range(1, $weeks_in_month)
        );
    }
}
