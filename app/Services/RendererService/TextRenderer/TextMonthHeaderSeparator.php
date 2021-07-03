<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;
use App\Services\RendererService\TextRenderer\Traits\Buildable;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;

class TextMonthHeaderSeparator
{
    use GeneratesTextLines, Buildable;

    private int $dayLength;
    private int $dayCount;

    /**
     * TextMonthHeaderSeparator constructor.
     * @param int $dayLength
     * @param int $dayCount
     */
    public function __construct(int $dayLength, int $dayCount)
    {
        $this->dayLength = $dayLength;
        $this->dayCount = $dayCount;
    }

    public function initialize()
    {
        $dayTop = str_repeat(TextRenderer::SEPARATOR_HORIZONTAL, $this->dayLength);

        $weekTop = str_repeat($dayTop . TextRenderer::TOP_MIDDLE, $this->dayCount - 1);

        $this->lines = [
            0 => TextRenderer::EDGE_LEFT_VERTICAL . $weekTop . $dayTop . TextRenderer::EDGE_RIGHT_VERTICAL
        ];

        return $this;
    }
}
