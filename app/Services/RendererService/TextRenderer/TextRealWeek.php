<?php


namespace App\Services\RendererService\TextRenderer;


use App\Collections\EpochsCollection;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;
use Illuminate\Support\Collection;

class TextRealWeek
{
    use GeneratesTextLines;

    private EpochsCollection $visualWeeks;

    /**
     * TextWeek constructor.
     * @param $visualWeeks
     */
    public function __construct(EpochsCollection $visualWeeks)
    {
        $this->visualWeeks = $visualWeeks->mapInto(TextVisualWeek::class);
    }

    public function build($dayLength, $weekLength)
    {
        return $this->visualWeeks
            ->mapWithKeys(function($week, $index) use ($dayLength, $weekLength){
                $weekIndex = $index + (2 * $index);
                $separatorIndex = $index + (2 * $index) + 1;

                return [
                    $weekIndex => $week->build($dayLength),
                    $separatorIndex => TextWeekSeparator::build($dayLength, $weekLength)
                ];
            });
    }
}
