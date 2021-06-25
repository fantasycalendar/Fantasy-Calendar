<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class TextVisualWeek
{
    public Collection $days;

    public function __construct($week)
    {
        $this->days = $week;
    }

    public function build($dayLength)
    {
        if($this->hasIntercalary()) {
            $this->pushDaysToFrontOfWeek();
        }

        $days = $this->days->map(function($item) use ($dayLength){
            if(is_null($item)) {
                return str_repeat(TextRenderer::SHADE, $dayLength);
            }

            return Str::padLeft($item->day, $dayLength, ' ');
        })->join(TextRenderer::SEPARATOR_VERTICAL);

        return TextRenderer::SEPARATOR_VERTICAL . $days . TextRenderer::SEPARATOR_VERTICAL;
    }

    private function pushDaysToFrontOfWeek()
    {
        $length = $this->days->count();

        $this->days = $this->days->filter(function($day){
            return is_object($day);
        })->pad($length, null);
    }

    public function hasIntercalary(): bool
    {
        return $this->days
                ->filter(function($day){
                    return optional($day)->isIntercalary;
                })->count() > 0;
    }
}
