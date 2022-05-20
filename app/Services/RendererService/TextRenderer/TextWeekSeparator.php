<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;

class TextWeekSeparator
{
    /**
     * @param $dayLength
     * @return string
     */
    public static function build($dayLength, $weekLength): string
    {
        $betweenDays = str_repeat(TextRenderer::SEPARATOR_HORIZONTAL, $dayLength);

        $fullSeparator = str_repeat($betweenDays . TextRenderer::SEPARATOR_INTERSECTION, $weekLength - 1);

        return TextRenderer::EDGE_LEFT_VERTICAL . $fullSeparator . $betweenDays . TextRenderer::EDGE_RIGHT_VERTICAL;
    }
}
