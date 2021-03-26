<?php


namespace App\Services\Discord\Commands\Command;


use App\Services\RendererService\MonthRenderer;
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

    public function handle(): string
    {
        $this->month = (new MonthRenderer($this->getDefaultCalendar()))->render();

        return $this->codeBlock($this->textRender());
    }

    /*
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
        $response = "";

        $this->cellLength = $this->determineCellLength();
        $this->lineLength = $this->determineLineLength();

        $header = $this->buildHeader();
        $footer = $this->buildFooter();

        $days = collect($this->month['weeks'])->map(function($week){
            return '|' . collect($week)->map(function($day){
                $contents = ($day['type'] == 'overflow')
                    ? str_repeat('▒', $this->cellLength)
                    : $day['month_day'];

                return Str::padLeft($contents, $this->cellLength, "-");
            })->join('|') . '|';
        })->join($this->buildWeeksGlue());

        return $header . $days . $footer;
    }

    private function buildWeeksGlue()
    {
        return "\n├".str_repeat(str_repeat('─', ($this->cellLength)) . '┼', count($this->month['weekdays']) - 1) . str_repeat('─', $this->cellLength)."┤\n";
    }

    private function buildHeader()
    {
        $header = '┌' . str_repeat('─', $this->lineLength - 2) . '┐' . "\n";
        $header .= '│' . Str::padBoth(Str::limit($this->month['name'], $this->lineLength - (3 + strlen($this->month['year'])), '') . " ▒ ". $this->month['year'], $this->lineLength, '-') . '│' . "\n";
        $header .= '├' . str_repeat(str_repeat('─', $this->cellLength) . '┬', count($this->month['weekdays']) - 1) . str_repeat('─', $this->cellLength) . '┤' . "\n";
        $header .= '│' . implode('│', array_map(function($item) { return str_pad(Str::limit($item, $this->cellLength, ''), $this->cellLength, '-', STR_PAD_LEFT); }, $this->month['weekdays'] )) . '│';
        $header .= $this->buildWeeksGlue();

        return $header;
    }

    private function buildFooter()
    {
        return "\n" . '└' . str_repeat(str_repeat('─', $this->cellLength) . '┴', count($this->month['weekdays']) - 1) . str_repeat('─', $this->cellLength) . '┘' . "\n";
    }

    private function determineLineLength()
    {
        return (($this->cellLength + 1) * count($this->month['weekdays'])) + 1;
    }

    private function determineCellLength()
    {
        return max(
            max(array_map(function($day) { return (strlen($day) > 3) ? 3 : strlen($day); }, $this->month['weekdays'])),
            strlen($this->month['length'])
        );
    }
}
