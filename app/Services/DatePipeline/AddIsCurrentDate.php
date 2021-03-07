<?php


namespace App\Services\DatePipeline;


use App\Services\DatePipeline\Traits\RendersPipeline;

class AddIsCurrentDate
{
    use RendersPipeline;

    public function processDay(array $day)
    {
        $day['is_current'] = ($day['month_day'] === $this->calendar->day);

        return $day;
    }
}
