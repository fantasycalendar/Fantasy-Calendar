<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;

class TextMonthFooter
{
    use GeneratesTextLines;

    private $dayLength;
    private $weekLength;

    public function __construct($dayLength, $weekLength)
    {
        $this->dayLength = $dayLength;
        $this->weekLength = $weekLength;
    }

    public static function build($dayLength, $weekLength)
    {
        return (new static($dayLength, $weekLength))->initialize();
    }

    public function initialize()
    {
        $dayBottom = str_repeat(TextRenderer::SEPARATOR_HORIZONTAL, $this->dayLength);

        $daySeparators = str_repeat($dayBottom . TextRenderer::BOTTOM_MIDDLE, $this->weekLength - 1);

        $this->lines = [
            0 => TextRenderer::BOTTOM_LEFT . $daySeparators . $dayBottom . TextRenderer::BOTTOM_RIGHT
        ];

        return $this;
    }
}
