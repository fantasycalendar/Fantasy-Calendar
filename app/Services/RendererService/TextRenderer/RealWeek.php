<?php


namespace App\Services\RendererService\TextRenderer;


use App\Collections\EpochsCollection;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class RealWeek
{
    use GeneratesTextLines;

    private EpochsCollection $visualWeeks;
    private $dayLength;
    private $weekLength;

    /**
     * TextWeek constructor.
     * @param $visualWeeks
     */
    public function __construct(EpochsCollection $visualWeeks)
    {
        $this->visualWeeks = $visualWeeks->mapInto(VisualWeek::class);
    }

    public function build($dayLength, $weekLength): RealWeek
    {
        $this->dayLength = $dayLength;
        $this->weekLength = $weekLength;

        $this->lines = $this->generateTextLines();

        $this->formatIntercalaries();

        return $this;
    }

    /**
     * Removes the last line
     *
     * @return $this
     */
    public function removeBottomLine(): RealWeek
    {
        array_pop($this->lines);

        return $this;
    }

    public function formatIntercalaries()
    {
        $this->visualWeeks->filter->hasIntercalary()->each(function ($week, $index){
            $this->insertLine(WeekBottom::build($this->dayLength, $this->weekLength)->toString(), $index);
            $this->replaceLine(WeekTopper::build($this->dayLength, $this->weekLength)->toString(), $index+1);
            $this->insertLine(WeekBottom::build($this->dayLength, $this->weekLength)->toString(), $index+$week->countLines()+1);
            $this->replaceLine(WeekTopper::build($this->dayLength, $this->weekLength)->toString(), $index+$week->countLines()+2);
        });
    }

    /**
     * Determine whether this week has any intercalary leap days in it
     *
     * @return bool
     */
    public function hasIntercalary(): bool
    {
        return $this->visualWeeks->filter->hasIntercalary()->count() > 0;
    }

    public function hasCurrentDate(): bool
    {
        return $this->visualWeeks->filter->hasCurrentDate()->count() > 0;
    }

    public function getCurrentDateRow()
    {
        $currentDateWeek = $this->visualWeeks->filter->hasCurrentDate()->sole();

        $linesToCurrentDate = $currentDateWeek->hasIntercalary()
            ? 2
            : 1;

        return $this->visualWeeks
            ->takeUntil->hasCurrentDate()
            ->sum->contributedLines()
            + $linesToCurrentDate;
    }

    public function getCurrentDate()
    {
        return $this->visualWeeks
            ->filter->hasCurrentDate()
            ->first()
            ->getCurrentDate();
    }

    public function getCurrentWeekday()
    {
        return $this->visualWeeks
            ->filter->hasCurrentDate()
            ->first()
            ->getCurrentWeekday();
    }

    public function contributedLines()
    {
        return $this->visualWeeks->sum->contributedLines();
    }

    /**
     * @return EpochsCollection
     */
    public function getWeekRows(): EpochsCollection
    {
        return $this->visualWeeks;
    }

    private function generateTextLines(): array
    {
        return $this->visualWeeks
            ->map(function($week, $index) {
                return $week->build($this->dayLength, $this->weekLength)->map(function($visualWeek){
                    return [
                        $visualWeek,
                        TextWeekSeparator::build($this->dayLength, $this->weekLength)
                    ];
                });
            })->flatten()->values()->toArray();
    }
}
