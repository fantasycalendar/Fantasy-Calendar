<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;
use App\Services\RendererService\TextRenderer\Traits\Buildable;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;

class TextMonthFooter
{
    use GeneratesTextLines, Buildable;

    private int $dayLength;
    private int $weekLength;

    public function __construct(int $dayLength, int $weekLength)
    {
        $this->dayLength = $dayLength;
        $this->weekLength = $weekLength;
    }

    /**
     * Initialize the bottom row of a month-wide grid
     *
     * @return $this
     */
    public function initialize(): TextMonthFooter
    {
        $dayBottom = str_repeat(TextRenderer::SEPARATOR_HORIZONTAL, $this->dayLength);

        $daySeparators = str_repeat($dayBottom . TextRenderer::BOTTOM_MIDDLE, $this->weekLength - 1);

        $this->lines = [
            0 => TextRenderer::BOTTOM_LEFT . $daySeparators . $dayBottom . TextRenderer::BOTTOM_RIGHT
        ];

        return $this;
    }
}
