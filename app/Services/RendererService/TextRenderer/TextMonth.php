<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;

class TextMonth
{
    use GeneratesTextLines;

    private $weeks;
    private $year;
    private $month;
    private $name;
    private $length;
    private $weekdays;
    private $minimum_day_length;
    private $internal_length;

    public function __construct(array $attributes)
    {
        $this->year = $attributes['year'];
        $this->month = $attributes['month'];
        $this->name = $attributes['name'];
        $this->length = $attributes['length'];
        $this->weekdays = $attributes['weekdays'];
        $this->weeks = $attributes['weeks'];
        $this->minimum_day_length = $attributes['min_day_text_length'];

        $this->internal_length = (($this->minimum_day_length + 1) * $this->weekdays->count());
    }

    public function build(): string
    {
        $parts = collect([
            TextMonthHeader::build($this->name, $this->internal_length, $this->year),
            TextMonthHeaderSeparator::build($this->minimum_day_length, $this->weekdays->count()),
            TextMonthDayNames::build($this->minimum_day_length, $this->weekdays),
            TextWeeksBody::build($this->weeks, $this->minimum_day_length, $this->weekdays->count()),
            TextMonthFooter::build($this->minimum_day_length, $this->weekdays->count())
        ]);

        dd($parts->toStrings(), $parts);

        return collect($parts)->flatten()->map->toString()->join("\n");
    }
}
