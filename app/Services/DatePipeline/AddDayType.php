<?php


namespace App\Services\DatePipeline;


use App\Services\DatePipeline\Traits\RendersPipeline;

class AddDayType
{
    use RendersPipeline;

    public function processDay($day)
    {
        $day['type'] = ($day['month_day'] > 0) ? 'day' : 'overflow';

        return $day;
    }
}
