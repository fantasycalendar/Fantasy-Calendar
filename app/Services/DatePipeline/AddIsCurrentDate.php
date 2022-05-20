<?php


namespace App\Services\DatePipeline;


use App\Services\DatePipeline\Traits\RendersPipeline;
use App\Services\EpochService\Epoch;

class AddIsCurrentDate
{
    use RendersPipeline;

    public function processDay($day)
    {
        if(!$day instanceof Epoch) return null;

        $day->isCurrent = ($day->day === $this->calendar->day);

        return $day;
    }
}
