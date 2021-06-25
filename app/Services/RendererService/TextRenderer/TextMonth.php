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
        $this->weeks = $attributes['weeks']->mapInto(TextRealWeek::class);
        $this->minimum_day_length = $attributes['min_day_text_length'];

        $this->internal_length = (($this->minimum_day_length + 1) * $this->weekdays->count());
    }

    public function build(): string
    {
        $headerLines = TextMonthHeader::build($this->name, $this->internal_length, $this->year);

        $headerSeparator = TextMonthHeaderSeparator::build($this->minimum_day_length, $this->weekdays->count());

        $dayNameLines = TextMonthDayNames::build($this->minimum_day_length, $this->weekdays);

        $weeksLines = $this->weeks->map->build($this->minimum_day_length, $this->weekdays->count())->flatten();

        // The last line will always be a garbage line that we need to replace. Might fix later.
        $weeksLines->pop();

        $footerLine = TextMonthFooter::build($this->minimum_day_length, $this->weekdays->count());

        return collect([$headerLines, $headerSeparator, $dayNameLines, $weeksLines, $footerLine])->flatten()->join("\n");
    }
}
