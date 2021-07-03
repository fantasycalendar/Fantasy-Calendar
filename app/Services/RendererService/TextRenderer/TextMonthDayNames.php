<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;
use App\Services\RendererService\TextRenderer\Traits\GeneratesTextLines;
use Illuminate\Support\Str;

class TextMonthDayNames
{
    use GeneratesTextLines;

    private $dayLength;
    private $weekdays;

    public function __construct($dayLength, $weekdays)
    {
        $this->dayLength = $dayLength;
        $this->weekdays = $weekdays;
    }

    public static function build($dayLength, $weekdays)
    {
        return (new static($dayLength, $weekdays))->initialize();
    }

    public function initialize()
    {
        $days = $this->weekdays->map(function($day) {
            return Str::padLeft(Str::limit($day, $this->dayLength, ''), $this->dayLength, ' ');
        })->join(TextRenderer::SEPARATOR_VERTICAL);

        $this->lines = [
            0 => TextRenderer::SEPARATOR_VERTICAL . $days . TextRenderer::SEPARATOR_VERTICAL,
            1 => TextWeekSeparator::build($this->dayLength, $this->weekdays->count())
        ];

        return $this;
    }
}
