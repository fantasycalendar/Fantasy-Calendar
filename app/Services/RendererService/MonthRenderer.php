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
    ];

    /**
     * YearRenderer constructor.
     * @param Calendar $calendar
     */
    public function __construct(Calendar $calendar)
    {
        $this->calendar = $calendar;

        /*if($this->calendar->overflows_week) {
            throw new \Exception('API rendering does not currently support overflowed weekdays.');
        }*/
    }

    /**
     * @param mixed $date The date you want to render (default is current) - array [year, month, day]
     * @return mixed
     */
    public function render($date = null)
    {
        if($date) {
            $this->calendar->setDate($date[0], $date[1], $date[2] + 1);
        }

        $pipelineData = [
            'render_data' => $this->calendar->month->getStructure(),
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
}
