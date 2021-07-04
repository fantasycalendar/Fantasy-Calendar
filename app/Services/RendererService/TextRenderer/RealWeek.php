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
            $this->insertLine(WeekBottom::build($this->dayLength, $this->weekLength)->toString(), $index+3);
            $this->replaceLine(WeekTopper::build($this->dayLength, $this->weekLength)->toString(), $index+4);
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

    public function getCurrentDate()
    {
        return $this->visualWeeks
            ->filter->hasCurrentDate()
            ->first()
            ->getCurrentDate();
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
            ->mapWithKeys(function($week, $index) {
                $weekIndex = $index + (2 * $index);
                $separatorIndex = $index + (2 * $index) + 1;

                return [
                    $weekIndex => $week->build($this->dayLength),
                    $separatorIndex => TextWeekSeparator::build($this->dayLength, $this->weekLength)
                ];
            })->values()->toArray();
    }
}
