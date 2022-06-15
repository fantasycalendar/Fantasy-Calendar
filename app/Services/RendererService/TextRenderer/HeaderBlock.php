<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;
use App\Services\RendererService\TextRenderer\Traits\Buildable;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;
use Illuminate\Support\Str;

class HeaderBlock
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

        $wrappedNameLines->each(function($line) {
            $this->lines[] = sprintf(
                TextRenderer::SEPARATOR_VERTICAL . '%s' . TextRenderer::SEPARATOR_VERTICAL,
                Str::padBoth($line, $this->internalLength, TextRenderer::SPACER)
            );
        });
    }
}
