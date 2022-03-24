<?php


namespace App\Services\DatePipeline\Traits;


use App\Models\Calendar;
use Closure;
use Illuminate\Support\Collection;

trait RendersPipeline
{
    /**
     * @var Calendar
     */
    public Calendar $calendar;
    /**
     * @var Collection
     */
    public array $renderData;

    public function handle(array $data, Closure $next)
    {
        $this->calendar = $data['calendar'];
        $this->renderData = $data['render_data'];

        $this->process();

        return $next([
            'calendar' => $this->calendar,
            'render_data' => $this->renderData
        ]);
    }

    public function process()
    {
        $this->renderData['weeks'] = $this->renderData['weeks']->map->map(function($week){
            return $week->map(function($day){
                return $this->processDay($day);
            });
        });
    }

    abstract public function processDay($renderData);
}
