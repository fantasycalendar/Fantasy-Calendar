<?php


namespace App\Services\RendererService\TextRenderer;


use App\Collections\EpochsCollection;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class TextRealWeek
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
        $this->visualWeeks = $visualWeeks->mapInto(TextVisualWeek::class);
    }

    public function build($dayLength, $weekLength): TextRealWeek
    {
        $this->dayLength = $dayLength;
        $this->weekLength = $weekLength;

        $this->lines = $this->generateTextLines();

        return $this;
    }

    /**
     * Removes the last line
     *
     * @return $this
     */
    public function removeBottomLine(): TextRealWeek
    {
        array_pop($this->lines);

        return $this;
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
            })->toArray();
    }
}
