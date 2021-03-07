<?php


namespace App\Services\DatePipeline;


use App\Services\DatePipeline\Traits\RendersPipeline;

class AddDayType
{
    use RendersPipeline;

    public function processDay($day)
    {
        return $day;
    }
}
