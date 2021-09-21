<?php


namespace App\Services\RendererService;


use App\Calendar;
use App\Services\RendererService\TextRenderer\Month;
use Illuminate\Support\Collection;

class TextRenderer
{
    public const TOP_LEFT = '┌';
    public const TOP_MIDDLE = '┬';
    public const TOP_RIGHT = '┐';
    public const BOTTOM_LEFT = '└';
    public const BOTTOM_MIDDLE = '┴';
    public const BOTTOM_RIGHT = '┘';

    public const EDGE_LEFT_VERTICAL = '├';
    public const EDGE_RIGHT_VERTICAL = '┤';
    public const SEPARATOR_VERTICAL = '│';
    public const SEPARATOR_HORIZONTAL = '─';
    public const SEPARATOR_INTERSECTION = '┼';

    public const SEPARATOR_HORIZONTAL_DOUBLE = '═';
    public const SEPARATOR_VERTICAL_DOUBLE = '║';
    public const TOP_LEFT_DOUBLE = '╔';
    public const TOP_RIGHT_DOUBLE = '╗';
    public const BOTTOM_RIGHT_DOUBLE = '╝';
    public const BOTTOM_LEFT_DOUBLE = '╚';

    public const SPACER = " ";
    public const SHADE = "×";

    /**
     * @var Collection
     */
    private Collection $months;
    private int $preferredMaxLength;

    /**
     * TextRenderer constructor.
     * @param Collection $months
     */
    public function __construct(Collection $months, $preferredMaxLength = 2000)
    {
        $this->preferredMaxLength = $preferredMaxLength;
        $this->months = $months->map(function($month) use ($preferredMaxLength) {
            $month['desired_maximum_text_length'] = $preferredMaxLength;

            return $month;
        })->mapInto(Month::class);
    }

    /**
     * @param Collection $months
     * @return TextRenderer
     */
    public static function make(Collection $months, $preferredMaxLength = 2000): TextRenderer
    {
        return new static($months, $preferredMaxLength);
    }

    /**
     * @param Calendar $calendar
     * @return string
     */
    public static function renderMonth(Calendar $calendar, $preferredMaxLength = 2000)
    {
        return static::make(collect([MonthRenderer::prepareFrom($calendar)]), $preferredMaxLength)
            ->toString();
    }

    /**
     * @return string
     */
    public function toString()
    {
        return $this->months
            ->map->build()
            ->map->toString()
            ->join("\n\n");
    }
}
