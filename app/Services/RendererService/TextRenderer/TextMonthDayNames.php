<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;
use Illuminate\Support\Str;

class TextMonthDayNames
{
    public static function build($dayLength, $weekdays)
    {
        $days = $weekdays->map(function($day) use ($dayLength){
            return Str::padLeft(Str::limit($day, $dayLength, ''), $dayLength, ' ');
        })->join(TextRenderer::SEPARATOR_VERTICAL);

        return [
            0 => TextRenderer::SEPARATOR_VERTICAL . $days . TextRenderer::SEPARATOR_VERTICAL,
            1 => TextWeekSeparator::build($dayLength, $weekdays->count())
        ];
    }
}
