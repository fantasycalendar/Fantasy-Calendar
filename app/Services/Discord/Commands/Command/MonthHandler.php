<?php


namespace App\Services\Discord\Commands\Command;


use App\Services\RendererService\MonthRenderer;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MonthHandler extends \App\Services\Discord\Commands\Command
{

    /**
     * @var mixed
     */
    private $month;
    /**
     * @var mixed
     */
    private $cellLength;
    /**
     * @var float|int
     */
    private $lineLength;
    private \Illuminate\Support\Collection $weeks;
    private \Illuminate\Support\Collection $weekdays;
    private $name;
    private $year;

    private $currentWeekIndex = null;
    private $currentWeekDayIndex = null;

    const TOP_LEFT = '┌';
    const TOP_MIDDLE = '┬';
    const TOP_RIGHT = '┐';
    const BOTTOM_LEFT = '└';
    const BOTTOM_MIDDLE = '┴';
    const BOTTOM_RIGHT = '┘';

    const EDGE_LEFT_VERTICAL = '├';
    const EDGE_RIGHT_VERTICAL = '┤';
    const SEPARATOR_VERTICAL = '│';
    const SEPARATOR_HORIZONTAL = '─';
    const SEPARATOR_INTERSECTION = '┼';

    const SEPARATOR_HORIZONTAL_DOUBLE = '═';
    const SEPARATOR_VERTICAL_DOUBLE = '║';
    const TOP_LEFT_DOUBLE = '╔';
    const TOP_RIGHT_DOUBLE = '╗';
    const BOTTOM_RIGHT_DOUBLE = '╝';
    const BOTTOM_LEFT_DOUBLE = '╚';

    const SPACER = " ";
    const SHADE = "×";

    /*
     * This gets called by the discord hook, and returns a string containing an entire calendar
     */
    public function handle(): string
    {
        $this->month = (new MonthRenderer($this->getDefaultCalendar()))->render();

        $this->weeks = collect($this->month['weeks'])->map(function($week) {
            return collect($week);
        });
        $this->weekdays = collect($this->month['weekdays'])->map(function($weekday) {
            if(strstr($weekday, 'Weekday ') !== false) {
                return str_replace('Weekday ', '', $weekday);
            }
        });
        $this->name = $this->month['name'];
        $this->year = $this->month['year'];

        $this->cellLength = $this->determineCellLength();
        $this->lineLength = $this->determineLineLength();

        return $this->codeBlock($this->textRender());
    }

    /**
     * Render the month layout of a calendar into a layout something like this:
     * ┌────────────────────┐
     * │ February ▒▒▒▒  2021 │
     * ├──┬──┬──┬──┬──┬──┬──┤
     * │Su│Mo│Tu│We│Th│Fr│Sa│
     * ├──┼──┼──┼──┼──┼──┼──┤
     * │▒▒│01│02│03│04│05│06│
     * ├──┼──┼──┼──┼──┼──┼──┤
     * │07│08│09│10│11│12│13│
     * ├──┼──┼──┼──┼──┼──┼──┤
     * │14│15│16│17│18│19│20│
     * ├──┼──╔══╗──┼──┼──┼──┤
     * │21│22║23║24│25│26│27│
     * └──┴──╚══╝──┴──┴──┴──┘
     */
    private function textRender()
    {
        $response = $this->buildHeader();

        $response = $response->merge(
            $this->outlineCurrentDate(
                $this->buildDays()
            )
        );

        return $response->join("\n");
    }

    /**
     * This returns a Collection of week day cell strings and glue. Example:
     * Illuminate\Support\Collection {#2049
     *  #items: array:7 [
     *    1 => "├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤"
     *    2 => "│  1│  2│  3│  4│  5│  6│  7│  8│  9│ 10│"
     *    3 => "├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤"
     *    4 => "│ 11│ 12│ 13│ 14│ 15│ 16│ 17│ 18│ 19│ 20│"
     *    5 => "├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤"
     *    6 => "│ 21│ 22│ 23│ 24│ 25│ 26│ 27│ 28│ 29│ 30│"
     *    7 => "└───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘"
     *  ]
     *}
     */
    private function buildDays()
    {
        return $this->weeks->mapWithKeys(function($days, $index) {
            if($days->where('is_current')->count()) {
                $this->currentWeekIndex = $index * 2;
            }

            // Transforms from "[{"month_day":1,"is_current":true,"type":"day","name":"Sul"},{"month_day":2,"is_current":false,"type":"day","name":"Mol"},...]"
            // Into "│  1│  2│  3│  4│  5│  6│  7│", spaced based on the cell length
            $dayTextLines = $days->reduceWithKeys(function($prevDay, $day, $index) {
                if($day['is_current']) $this->currentWeekDayIndex = ($index * ($this->cellLength + 1) + 1);

                return $prevDay . self::SEPARATOR_VERTICAL . $this->dayContents($day);
            }) . self::SEPARATOR_VERTICAL;

            return [
                ($index * 2) - 1 => $this->buildWeeksGlue(),
                ($index * 2) => $dayTextLines,
            ];
        })->push($this->buildFooter());
    }

    private function outlineCurrentDate($days)
    {
        $days = $days->toArray();

        $stringsToReplace = collect([
            [
                'content' => self::TOP_LEFT_DOUBLE,
                'length' => 1,
                'X' => -1,
                'Y' => -1
            ],
            [
                'content' => self::SEPARATOR_HORIZONTAL_DOUBLE,
                'length' => $this->cellLength,
                'X' => 0,
                'Y' => -1,
            ],
            [
                'content' => self::TOP_RIGHT_DOUBLE,
                'length' => 1,
                'X' => $this->cellLength,
                'Y' => -1,
            ],
            [
                'content' => self::SEPARATOR_VERTICAL_DOUBLE,
                'length' => 1,
                'X' => -1,
                'Y' => 0,
            ],
            [
                'content' => self::SEPARATOR_VERTICAL_DOUBLE,
                'length' => 1,
                'X' => $this->cellLength,
                'Y' => 0,
            ],
            [
                'content' => self::BOTTOM_LEFT_DOUBLE,
                'length' => 1,
                'X' => -1,
                'Y' => 1,
            ],
            [
                'content' => self::SEPARATOR_HORIZONTAL_DOUBLE,
                'length' => $this->cellLength,
                'X' => 0,
                'Y' => 1,
            ],
            [
                'content' => self::BOTTOM_RIGHT_DOUBLE,
                'length' => 1,
                'X' => $this->cellLength,
                'Y' => 1,
            ],
        ]);

        $stringsToReplace->each(function($replacement) use (&$days) {
            $x = $this->currentWeekDayIndex + $replacement['X'];
            $y = $this->currentWeekIndex + $replacement['Y'];

            $days[$y] = mb_substr_replace($days[$y], $replacement['content'], $x, $replacement['length']);
        });

        return collect($days);
    }

    private function buildWeeksGlue()
    {
        $glueLine = str_repeat(str_repeat('─', ($this->cellLength)) . '┼', count($this->month['weekdays']) - 1) . str_repeat('─', $this->cellLength);

        return sprintf('%s%s%s', self::EDGE_LEFT_VERTICAL, $glueLine, self::EDGE_RIGHT_VERTICAL);
    }

    private function dayContents($day)
    {
        $contents = ($day['type'] == 'overflow')
            ? str_repeat(self::SHADE, $this->cellLength)
            : $day['month_day'];

        return Str::padLeft($contents, $this->cellLength, self::SPACER);
    }

    /**
     * Returns the first few lines of the ASCII calendar, like:
     * ┌────────────────────┐
     * │ February ▒▒▒▒  2021 │
     * ├──┬──┬──┬──┬──┬──┬──┤
     * │Su│Mo│Tu│We│Th│Fr│Sa│
     */
    private function buildHeader(): Collection
    {
        $headerLines = collect();

        // Top line
        $headerLines->push(sprintf("┌%s┐", str_repeat('─', $this->lineLength - 2)));

        // Insert name lines
        $headerLines = $headerLines->merge($this->buildNameLines());

        // Separator line
        $cellCapLine = $this->weekdays->map(function($weekday) {
            return str_repeat('─', $this->cellLength);
        })->join(self::TOP_MIDDLE);

        $headerLines->push(sprintf('%s%s%s', self::EDGE_LEFT_VERTICAL, $cellCapLine, self::EDGE_RIGHT_VERTICAL));

        // Day name row
        $dayNames = $this->weekdays->map(function($weekday) {
            return Str::padLeft(Str::limit($weekday, $this->cellLength, ''), $this->cellLength);
        })->join(self::SEPARATOR_VERTICAL);
        $headerLines->push(sprintf('%s%s%s', self::SEPARATOR_VERTICAL, $dayNames, self::SEPARATOR_VERTICAL));

        return $headerLines;
    }

    /**
     * Returns a string of name lines, like:
     * │      March/Ches (The Claw of the      │
     * │           Sunsets) ▒▒▒ 1492           │
     *
     * @return string
     */
    private function buildNameLines()
    {
        // Tack on 3 of our shade character and the year to the name header
        $yearLine = str_repeat(self::SHADE, 2) . " {$this->year} " . str_repeat(self::SHADE, 2);

        // If our name will have more than 2 spaces on either side, we give it some room to breathe
        // By word-wrapping quite a bit early. Should help alleviate ugly dangling single 2-4 letter words
        $wrappedNameLines = (strlen($this->name) > $this->lineLength - 4)
            ? collect(explode("\n", wordwrap($this->name, $this->lineLength - 8)))
            : collect($this->name);

        $wrappedNameLines->prepend($yearLine);

        // OK So... I know this is weird.
        // In short, our self::SHADE character is **technically** 3 characters.
        // So since strlen(self::SHADE) = 3, even though it shows as one in a monospace font, the disparity of
        // 3 in the data versus 1 in display means, if we want to have our endcaps all line up on that text line visually,
        // then on whichever of our lines contains the shade, we have to offset the max length by the the 3 shade characters.
        // We **WOULD** offset by 6, except that is further offset by 2 in the opposite direction by the endcaps.
        return $wrappedNameLines->map(function($line) {
            $limit = Str::contains($line, self::SHADE)
                ? $this->lineLength + 2
                : $this->lineLength - 2;
//            $limit = $this->lineLength - 2;
            return sprintf(self::SEPARATOR_VERTICAL . '%s' . self::SEPARATOR_VERTICAL, Str::padBoth($line, $limit, self::SPACER));
        });
    }

    private function buildFooter()
    {
        return sprintf('%s%s%s', self::BOTTOM_LEFT,str_repeat(str_repeat('─', $this->cellLength) . '┴', count($this->month['weekdays']) - 1) . str_repeat('─', $this->cellLength), self::BOTTOM_RIGHT);
    }

    /**
     * Take our cell length and add 1 to it (for a spacer at the end of each cell)
     * Take THAT value and multiply it by each weekday. From there, add one more
     * to represent the left-most spacer. That's our total line length.
     */
    private function determineLineLength()
    {
        return (($this->cellLength + 1) * count($this->month['weekdays'])) + 1;
    }

    /**
     * Determine a minimum viable cell length. This can be affected by one of two factors:
     * - Longest month day number. If a month has 101 days, for instance, a cell cannot
     * be any shorter than 3 characters.
     * - Shortest character length our day names can be and still be unique.
     */
    private function determineCellLength()
    {
        return max(
            $this->findShortestUniquePrefixLength($this->weekdays),
            strlen($this->month['length'])
        );
    }

    /**
     * Recursively determine the shortest we can make our weekday name(s), while
     * still keeping the resulting values unique. As an example, if we have days
     * like 'First' and 'Fifth', for example, 'Fir' and 'Fif' are unique,
     * while 'Fi' and 'Fi' are not. So we only shorten as far as we can.
     *
     * @param $weekdays
     * @param null $length
     * @return int|mixed
     */
    private function findShortestUniquePrefixLength($weekdays, $length = null): int
    {
        $length = $length ?? $weekdays->map(function($weekday) {
            return strlen($weekday);
        })->max();

        $matchedShortNames = $weekdays->countBy(function($dayName) use ($length) {
            return Str::limit($dayName, $length, '');
        })->max();

        return ($matchedShortNames === 1)
            ? $this->findShortestUniquePrefixLength($weekdays, $length - 1) // All unique, check one more level
            : $length + 1; // Found duplicates! That means our length is truncating too far.
    }
}
