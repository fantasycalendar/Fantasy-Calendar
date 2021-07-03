<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;
use App\Services\RendererService\TextRenderer\Traits\Buildable;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;
use Illuminate\Support\Str;

class TextMonthHeader
{
    use GeneratesTextLines, Buildable;

    private string $monthName;
    private int $internalLength;
    private int $year;

    /**
     * TextMonthHeader constructor.
     * @param $monthName
     * @param $internalLength
     * @param $year
     */
    public function __construct(string $monthName, int $internalLength, int $year)
    {
        $this->monthName = $monthName;
        $this->internalLength = $internalLength - 1;
        $this->year = $year;
    }

    public function initialize(): self
    {
        $this->createTopLine();
        $this->createNameLines();

        return $this;
    }

    private function createTopLine()
    {
        $this->lines[] = TextRenderer::TOP_LEFT . str_repeat(TextRenderer::SEPARATOR_HORIZONTAL, $this->internalLength) . TextRenderer::TOP_RIGHT;
    }

    /**
     * Builds a string of name lines, like:
     * │      March/Ches (The Claw of the      │
     * │           Sunsets) ▒▒▒ 1492           │
     *
     * @return void
     */
    private function createNameLines()
    {
        // Tack on 3 of our shade character and the year to the name header
        $yearLine = str_repeat(TextRenderer::SHADE, 2) . " Year {$this->year} " . str_repeat(TextRenderer::SHADE, 2);

        // If our name will have more than 2 spaces on either side, we give it some room to breathe
        // By word-wrapping quite a bit early. Should help alleviate ugly dangling single 2-4 letter words
        $wrappedNameLines = (strlen($this->monthName) > $this->internalLength - 2)
            ? collect(explode("\n", wordwrap($this->monthName, $this->internalLength - 6)))
            : collect($this->monthName);

        $wrappedNameLines->prepend($yearLine);

        // OK So... I know this is weird.
        // In short, our TextRenderer::SHADE character is **technically** 3 characters.
        // So since strlen(TextRenderer::SHADE) = 3, even though it shows as one in a monospace font, the disparity of
        // 3 in the data versus 1 in display means, if we want to have our endcaps all line up on that text line visually,
        // then on whichever of our lines contains the shade, we have to offset the max length by the the 3 shade characters.
        // We **WOULD** offset by 6, except that is further offset by 2 in the opposite direction by the endcaps.
        $wrappedNameLines->each(function($line) {
            $limit = Str::contains($line, TextRenderer::SHADE)
                ? $this->internalLength + 4
                : $this->internalLength;

            $this->lines[] = sprintf(TextRenderer::SEPARATOR_VERTICAL . '%s' . TextRenderer::SEPARATOR_VERTICAL, Str::padBoth($line, $limit, TextRenderer::SPACER));
        });
    }
}
