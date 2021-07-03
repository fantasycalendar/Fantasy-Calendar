<?php


namespace App\Services\RendererService\TextRenderer;


use App\Collections\EpochsCollection;
use App\Services\RendererService\TextRenderer\Traits\Buildable;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;

class TextWeeksBody
{
    use GeneratesTextLines, Buildable;

    private EpochsCollection $weeks;
    private int $day_length;
    private int $week_length;

    public function __construct(EpochsCollection $weeks, int $day_length, int $week_length)
    {

        $this->weeks = $weeks->mapInto(TextRealWeek::class);
        $this->day_length = $day_length;
        $this->week_length = $week_length;
    }

    public function initialize(): self
    {
        $this->lines = $this->weeks
            ->map->build($this->day_length, $this->week_length)
            ->flatten()
            ->tap(function($weeks){
                $weeks->last()->removeBottomLine();
            })
            ->map->getLines()
            ->flatten()
            ->toArray();

        return $this;
    }
}
