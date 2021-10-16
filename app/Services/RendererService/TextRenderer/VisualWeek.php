<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class VisualWeek
{
    public Collection $days;
    private Collection $lines;

    public function __construct($week)
    {
        $this->days = $week;
    }

    public function build($dayLength, $weekLength)
    {
        if($this->hasIntercalary()) {
            $this->pushDaysToFrontOfWeek();
        }

        $this->lines = $this->days->chunk($weekLength)->map(function($chunk) use ($dayLength, $weekLength){
            return TextRenderer::SEPARATOR_VERTICAL . $chunk->pad($weekLength, null)->map(function($item) use ($dayLength){
                if(is_null($item)) {
                    return str_repeat(TextRenderer::SHADE, $dayLength);
                }

                $dayContents = ($item->isNumbered)
                    ? $item->visualDay
                    : "*";

                return Str::padLeft($dayContents, $dayLength, ' ');
            })->join(TextRenderer::SEPARATOR_VERTICAL) . TextRenderer::SEPARATOR_VERTICAL;
        });

        return $this->lines;
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

    public function hasCurrentDate(): bool
    {
        return $this->days
            ->filter(function($day){
                return optional($day)->isCurrent;
            })->count() > 0;
    }

    public function getCurrentDate()
    {
        return $this->days
            ->filter(function($day){
                return optional($day)->isCurrent;
            })->first()->day;
    }

    public function getCurrentWeekDay()
    {
        return $this->days
            ->filter(function($day){
                return optional($day)->isCurrent;
            })->first()->visualWeekdayIndex;
    }

    public function contributedLines()
    {
        return ($this->hasIntercalary())
            ? $this->countLines() + 2
            : $this->countLines();
    }

    public function countLines()
    {
        return $this->lines->count() * 2;
    }
}
