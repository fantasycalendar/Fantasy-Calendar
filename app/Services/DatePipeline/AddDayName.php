<?php


namespace App\Services\DatePipeline;


use App\Services\DatePipeline\Traits\RendersPipeline;
use Illuminate\Support\Arr;

class AddDayName
{
    use RendersPipeline;

    public function processDay($day)
    {
        return $day;
    }
}
