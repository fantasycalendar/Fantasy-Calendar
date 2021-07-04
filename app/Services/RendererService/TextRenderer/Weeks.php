<?php


namespace App\Services\RendererService\TextRenderer;


use App\Collections\EpochsCollection;
use App\Services\RendererService\TextRenderer\Traits\Buildable;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;

class Weeks
{
    use GeneratesTextLines, Buildable;

    private EpochsCollection $weeks;
    public int $day_length;
    public int $week_length;

    public function __construct(EpochsCollection $weeks, int $day_length, int $week_length)
    {

        $this->weeks = $weeks->mapInto(RealWeek::class);
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

    /**
     * Get the underlying weeks in the weeks class
     *
     * @return EpochsCollection
     */
    public function getRealWeeks(): EpochsCollection
    {
        return $this->weeks;
    }

    public function getCurrentDate()
    {
        return $this->weeks
            ->filter->hasCurrentDate()
            ->first()->getCurrentDate();
    }
}
