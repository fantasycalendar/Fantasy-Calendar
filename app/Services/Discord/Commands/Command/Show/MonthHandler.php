<?php


namespace App\Services\Discord\Commands\Command\Show;


use App\Models\Calendar;
use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;
use App\Services\Discord\Exceptions\DiscordCalendarNotSetException;
use App\Services\Discord\Commands\Command;
use App\Services\RendererService\ImageRenderer;
use App\Services\RendererService\TextRenderer;
use Illuminate\Support\Str;

class MonthHandler extends Command
{
    use PremiumCommand;

    private Calendar $calendar;

    private array $availableRenderers = [
        'text' => TextRenderer::class,
        'image' => ImageRenderer::class,
    ];

    public static function signature(): string
    {
        return 'show month';
    }

    /**
     * Generate a
     *
     * @return string
     * @throws DiscordCalendarNotSetException
     */
    public function handle()
    {
        logger('MonthHandler::handle entered');

        return $this->respondWith($this->setting('renderer') ?? 'text', $this->getDefaultCalendar());
    }

    public static function respondWith($renderer, $calendar)
    {
        $renderer = "render" . ucfirst($renderer);

        return self::$renderer($calendar);
    }

    /**
     * @param $calendar
     * @return Response
     */
    public static function renderImage($calendar): Response
    {
        logger($calendar->imageLink('png', ['theme' => 'discord', 'size' => 'md', 'year' => $calendar->year, 'month_id' => $calendar->month_id, 'day' => $calendar->day]));

        return Response::make(self::getCurrentTime($calendar))
            ->embedMedia($calendar->imageLink('png',
                [
                    'theme' => 'discord',
                    'size' => 'md',
                    'year' => $calendar->year,
                    'month_id' => $calendar->month_id,
                    'day' => $calendar->day
                ]));
    }

    /**
     * @param $calendar
     * @return string
     */
    public static function renderText($calendar): Response
    {
        $month = TextRenderer::renderMonth($calendar);


        if(Str::length($month) > 1900 || Str::length(explode("\n" ,$month)[0]) > 80) {
            $month = self::clipMonthToFit($month);
        }

        return Response::make(self::getCurrentTime($calendar) . self::codeBlock($month));
    }

    public static function getCurrentTime(Calendar $calendar): string
    {
        return ($calendar->clock_enabled && !$calendar->setting('hide_clock'))
            ? "Current time: ". $calendar->current_time
            : "";
    }

    /**
     * Horizontally clips a month to fit into the 2,000 character limit of Discord.
     *
     * @param $month
     * @return string
     */
    public static function clipMonthToFit($month): string
    {
        logger("got here");
        $month = collect(explode("\n", $month));
        $dayLength = clamp(self::determineDayLength($month), 12, 28);

        logger("Day length $dayLength");
        if($dayLength == Str::length($month->first())) {
            return $month->join("\n");
        }

        logger("Got to the part where we clip");
        /* Ok so we're going to clip horizontally. First let's trim the header lines*/
        $headerLineContents = self::trimHeaderLines($month);
        $width = self::determineClipWidth($dayLength, $headerLineContents, $month);

        $firstLineOfCurrentDate = $month->filter(function($line){
            return Str::contains($line, TextRenderer::TOP_LEFT_DOUBLE);
        })->first();

        $startColumn = max(Str::length(Str::before($firstLineOfCurrentDate, TextRenderer::TOP_LEFT_DOUBLE)) - $dayLength, 0);

        /* Trim the day lines */
        $month = $month->map(function($line) use ($startColumn, $width) {
            return Str::substr($line, $startColumn, $width);
        });

        /* Inject our new header lines */
        $lineToReplace = 1;
        $headerLineContents->each(function($headerLine) use ($width, &$month, &$lineToReplace){
            if(Str::contains($headerLine, TextRenderer::SHADE)) {
                $width += 4; // Fix multibyte string of ×
            }

            $newHeader = Str::padBoth($headerLine, $width);
            logger("Replacing '" . $month->get($lineToReplace) . "' with '" . $newHeader . "'");
            $month->put($lineToReplace, $newHeader);
            $lineToReplace++;
        });

        $start = $startColumn
            ? "..."
            : "";

        $end = $startColumn + $width < Str::length($firstLineOfCurrentDate)
            ? "..."
            : "";

        $result = "(Trimmed to fit Discord character limit)". "\n$start" . $month->join("$end\n$start") . "$end";

        logger($result);

        return $result;
    }

    private static function trimHeaderLines($month)
    {
        $foundHorizontalSeparators = 0;
        $headerLinesCount = -1;
        return $month->takeUntil(function($line) use (&$headerLinesCount, &$foundHorizontalSeparators) {
                if(Str::contains($line, TextRenderer::SEPARATOR_HORIZONTAL)) $foundHorizontalSeparators++;

                $headerLinesCount++;

                return $foundHorizontalSeparators >= 2;
            })
            ->slice(1, $headerLinesCount)
            ->map(fn($line) => Str::replace(TextRenderer::SEPARATOR_VERTICAL, '', $line))
            ->map(fn($line) => trim($line));
    }

    /**
     * Determine which is shorter:
     * - min(Length of 1 day times 3, longest header line content)
     * - Length of 1 line
     *
     * @param $dayLength
     * @param $headerLineContents
     * @param $month
     * @return mixed
     */
    private static function determineClipWidth($dayLength, $headerLineContents, $month)
    {
        $minimumClipWidth = $headerLineContents->max(fn($line) => Str::length($line)) + 2;

        return min(max($dayLength * 3, $minimumClipWidth), Str::length($month->first()));
    }

    /**
     * Determines the length of a day by finding the current day and measuring it
     *
     * @param $month
     * @return int
     */
    private static function determineDayLength($month): int
    {
        /* First things first: Make sure we can actually clip the month. */
        $firstLineOfCurrentdate = $month->filter(function($line){
            return Str::contains($line, TextRenderer::TOP_LEFT_DOUBLE);
        })->first();

        return (Str::substrCount($firstLineOfCurrentdate, TextRenderer::SEPARATOR_HORIZONTAL_DOUBLE) + 2);
    }

    private function renderer()
    {
        return $this->availableRenderers[$this->setting('renderer') ?? 'text'];
    }
}
