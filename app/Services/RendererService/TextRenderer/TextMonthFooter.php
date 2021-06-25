<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;

class TextMonthFooter
{
    public static function build($dayLength, $weekLength)
    {
        $dayBottom = str_repeat(TextRenderer::SEPARATOR_HORIZONTAL, $dayLength);

        $daySeparators = str_repeat($dayBottom . TextRenderer::BOTTOM_MIDDLE, $weekLength - 1);

        return [
            0 => TextRenderer::BOTTOM_LEFT . $daySeparators . $dayBottom . TextRenderer::BOTTOM_RIGHT
        ];
    }
}
