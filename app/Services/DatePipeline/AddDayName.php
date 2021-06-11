<?php


namespace App\Services\DatePipeline;


use App\Services\DatePipeline\Traits\RendersPipeline;
use Illuminate\Support\Arr;

class AddDayName
{
    use RendersPipeline;

    public function processDay($day)
    {
        $day['name'] = ($day['month_day'] > 0) ? $this->resolveDayName($day): null;

        return $day;
    }

    private function resolveDayName($day)
    {
        $index = ((intval($day['month_day']) - 1) % count($this->calendar->week));

        return Arr::get($this->calendar->week, $index);
    }
}
