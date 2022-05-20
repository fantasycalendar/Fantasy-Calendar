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
    private bool $month_is_intercalary;

    public function __construct(EpochsCollection $weeks, int $day_length, int $week_length, bool $month_is_intercalary)
    {
        $this->weeks = $weeks->mapInto(RealWeek::class);
        $this->day_length = $day_length;
        $this->week_length = $week_length;
        $this->month_is_intercalary = $month_is_intercalary;
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
        return $this->getCurrentDateWeek()->getCurrentDate();
    }

    public function getCurrentWeekday()
    {
        return $this->getCurrentDateWeek()->getCurrentWeekday();
    }

    public function getCurrentDayRow()
    {
        if($this->month_is_intercalary) {
            if($this->lineCount() === 1) {
                return 1;
            }
        }

        return $this->weeks
                    ->takeUntil->hasCurrentDate()
                    ->sum->contributedLines()
             + $this->getCurrentDateWeek()
                    ->getCurrentDateRow($this->month_is_intercalary);
    }

    private function getCurrentDateWeek()
    {
        return $this->weeks
            ->filter->hasCurrentDate()
            ->first();
    }
}
