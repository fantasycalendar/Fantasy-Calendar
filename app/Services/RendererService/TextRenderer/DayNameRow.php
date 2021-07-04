<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;
use App\Services\RendererService\TextRenderer\Traits\Buildable;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class DayNameRow
{
    use GeneratesTextLines, Buildable;

    private int $dayLength;
    private Collection $weekdays;

    public function __construct(int $dayLength, Collection $weekdays)
    {
        $this->dayLength = $dayLength;
        $this->weekdays = $weekdays;
    }

    /**
     * Initialize the month's day name row
     *
     * @return $this
     */
    public function initialize(): DayNameRow
    {
        $days = $this->weekdays->map(function($day) {
            return Str::padLeft(Str::limit($day, $this->dayLength, ''), $this->dayLength, ' ');
        })->join(TextRenderer::SEPARATOR_VERTICAL);

        $this->lines = [
            0 => TextRenderer::SEPARATOR_VERTICAL . $days . TextRenderer::SEPARATOR_VERTICAL,
            1 => TextWeekSeparator::build($this->dayLength, $this->weekdays->count())
        ];

        return $this;
    }
}
