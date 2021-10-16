<?php


namespace App\Services\RendererService;


use App\Calendar;
use App\Services\CalendarService\LeapDay;
use App\Services\DatePipeline\AddIsCurrentDate;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

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
    }

    /**
     * @return mixed
     */
    public function prepare()
    {
        $pipelineData = [
            'render_data' => $this->calendar->render_month->getStructure(),
            'calendar' => $this->calendar
        ];

        return (new Pipeline(app()))
                    ->send($pipelineData)
                    ->through($this->pipeline)
                    ->then($this->verifyData());
    }

    /**
     * @param $calendar
     * @return mixed
     */
    public static function prepareFrom($calendar)
    {
        return (new static($calendar))->prepare();
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
