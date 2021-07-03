<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;
use Illuminate\Pipeline\Pipeline;

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
        $this->pipeline = (new Pipeline(app()));
    }

    public function build(): self
    {
        $parts = collect([
            TextMonthHeader::class => TextMonthHeader::build($this->name, $this->internal_length, $this->year),
            TextMonthHeaderSeparator::class => TextMonthHeaderSeparator::build($this->minimum_day_length, $this->weekdays->count()),
            TextMonthDayNames::class => TextMonthDayNames::build($this->minimum_day_length, $this->weekdays),
            TextWeeksBody::class => TextWeeksBody::build($this->weeks, $this->minimum_day_length, $this->weekdays->count()),
            TextMonthFooter::class => TextMonthFooter::build($this->minimum_day_length, $this->weekdays->count())
        ]);

        $this->lines = $parts->toArrays()
            ->flatten()
            ->toArray();

        return $this;
    }

    public function toString()
    {
        return implode("\n", $this->lines);
    }
}
