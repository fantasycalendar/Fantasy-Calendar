<?php


namespace App\Services\RendererService\TextRenderer;


use App\Services\RendererService\TextRenderer;
use App\Services\RendererService\TextRenderer\Exceptions\TextRendererOutputTooLongException;
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
    private $clean_weekdays;
    private $desired_maximum_text_length;
    private $original_min_day_length;

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
        $this->clean_weekdays = $attributes['clean_weekdays'];
        $this->weeks = $attributes['weeks'];
        $this->minimum_day_length = $attributes['min_day_text_length'];
        $this->original_min_day_length = $attributes['min_day_text_length'];
        $this->desired_maximum_text_length = $attributes['desired_maximum_text_length'] ?? 2000;
    }

    public function build(): self
    {
        $this->sanityCheck(); // Make sure we're not gonna _completely_ overblow our text length max.

        do {
            $this->compile();

            if(mb_strlen($this->toString()) < $this->desired_maximum_text_length) {
                return $this;
            }

            $this->minimum_day_length--;
//            logger('String length was ' . mb_strlen($this->toString()) . ", reducing minimum day length to {$this->minimum_day_length} and trying again.");
        } while ($this->minimum_day_length > 3 && $this->minimum_day_length >= strlen($this->length));

//        logger($this->toString());
        //

        // We tried our best to smartly trim lengths, based on our maximum text length. However ... It didn't really work.
        // Rather than mangle the user's calendar by squishing it super tight ... Let's just render it how we would have before refinement.
        // Then anything calling the text renderer can handle trimming our output to their liking.
        $this->minimum_day_length = $this->original_min_day_length;
        $this->compile();

        return $this;
    }

    private function compile()
    {
        $parts = [
            HeaderBlock::class => HeaderBlock::build($this->name, $this->internalLength(), $this->year),
            MonthTopper::class => MonthTopper::build($this->minimum_day_length, $this->weekdays->count()),
            DayNameRow::class => DayNameRow::build($this->minimum_day_length, $this->clean_weekdays),
            Weeks::class => Weeks::build($this->weeks, $this->minimum_day_length, $this->weekdays->count(), $this->month->intercalary),
            WeekBottom::class => WeekBottom::build($this->minimum_day_length, $this->weekdays->count())
        ];

        $payload = PipelinePayload::build($parts, $this->minimum_day_length);

        $this->lines = (new Pipeline(app()))
            ->send($payload)
            ->through($this->pipeline)
            ->then($this->verifyParts())
            ->getLines();
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

    private function sanityCheck()
    {
        if($this->estimateCharacterCount() > 1800) {
            $this->refineMinimumDayLength();
        }
    }

    private function refineMinimumDayLength()
    {
//        logger("Found that our calendar was too long! Refining...");
        $attempts = 0;
//        logger("Starting with a minimum day length of {$this->minimum_day_length}");

        do {
            $this->minimum_day_length = max(3, $this->minimum_day_length - 1);
//            logger("Minimum day length reduced to {$this->minimum_day_length}");
            $estimatedCount = $this->estimateCharacterCount();
//            logger("That makes our new estimate {$estimatedCount}");
            $monthWidth = $this->internalLength() + 2;
//            logger("Our rendered month will be {$monthWidth} characters wide");

            if($estimatedCount < 1800 && $monthWidth < 150) {
                return;
            }

            $attempts++;
//            logger("Attempted to refine length $attempts times so far.\n\n");
        } while($this->minimum_day_length > 3 && $this->minimum_day_length >= strlen($this->length));
    }

    private function estimateCharacterCount()
    {
        $width = $this->internalLength() + 2; // Remember we have endcap characters
//        logger("width: $width");
        $headerHeight = 4; // To be super conservative, let's assume one more line of header height than most will have.
//        logger("headerHeight: $headerHeight");
        $dayNameRowHeight = 2; // This is just basically always true. Day numbers + one row for separator.
//        logger("dayNameRowHeight: $dayNameRowHeight");
        $weekRowHeight = $this->weeks->count() * 2; // Every week (except visual weeks created by leap days ...) will be 2 characters high: The day number, and the separator above it.
//        logger("weekRowHeight: $weekRowHeight");
        $footerHeight = 1; // Our footer is currently a single line.
//        logger("footerHeight: $footerHeight");

        $estimate = $width * ($headerHeight + $dayNameRowHeight + $weekRowHeight + $footerHeight);

//        logger("estimate: $estimate");

        return $estimate;
    }

    /**
     * @return int
     */
    private function internalLength(): int
    {
        return (($this->minimum_day_length + 1) * $this->weekdays->count());
    }
}
