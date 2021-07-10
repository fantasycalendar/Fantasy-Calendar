<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;
use Illuminate\Pipeline\Pipeline;

class Month
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

    private array $pipeline = [
        TextRenderer\Pipeline\HighlightCurrentDay::class
    ];

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

    public function build(): self
    {
        $parts = [
            HeaderBlock::class => HeaderBlock::build($this->name, $this->internal_length, $this->year),
            MonthTopper::class => MonthTopper::build($this->minimum_day_length, $this->weekdays->count()),
            DayNameRow::class => DayNameRow::build($this->minimum_day_length, $this->weekdays),
            Weeks::class => Weeks::build($this->weeks, $this->minimum_day_length, $this->weekdays->count()),
            WeekBottom::class => WeekBottom::build($this->minimum_day_length, $this->weekdays->count())
        ];

        $payload = PipelinePayload::build($parts, $this->minimum_day_length);

        $this->lines = (new Pipeline(app()))
            ->send($payload)
            ->through($this->pipeline)
            ->then($this->verifyParts())
            ->getLines();

        return $this;
    }

    public function toString()
    {
        return implode("\n", $this->lines);
    }

    /**
     * Returns a closure used when verifying our render data
     * Currently it just returns. Should probably actually
     * verify the data we pass through it at some point.
     * @return \Closure
     */
    private function verifyParts()
    {
        return function ($data) {
            return $data;
        };
    }
}
