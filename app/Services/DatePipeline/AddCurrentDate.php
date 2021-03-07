<?php


namespace App\Services\DatePipeline;


use Closure;

class AddCurrentDate
{
    public function handle(array $renderData, Closure $next)
    {
        $calendar = $renderData['calendar'];
        $renderData = $renderData['render_data'];

        $renderData['weeks'] = $renderData['weeks']->map(function($week) use ($calendar) {
            return $week->map(function($day) use ($calendar) {
                $day['is_current'] = ($day['month_day'] === $calendar->dynamic_data['day']);

                return $day;
            });
        });

        return $renderData;
    }
}
