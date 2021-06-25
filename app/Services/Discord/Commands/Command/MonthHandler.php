<?php


namespace App\Services\Discord\Commands\Command;


use App\Services\RendererService\TextRenderer;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MonthHandler extends \App\Services\Discord\Commands\Command
{
    /*
     * This gets called by the discord hook, and returns a string containing an entire calendar
     */
    public function handle(): string
    {
        $renderText = TextRenderer::renderMonth($this->getDefaultCalendar());

        return $this->codeBlock($renderText);
    }

    private function outlineCurrentDate($days)
    {
        $days = $days->flatten()->toArray();

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

//        $stringsToReplace->each(function($replacement) use (&$days) {
//            $x = $this->currentWeekDayIndex + $replacement['X'];
//            $y = $this->currentWeekIndex + $replacement['Y'];
//
//            if($y == -1) {
//                dd($days);
//            }
//
//            $days[$y] = mb_substr_replace($days[$y], $replacement['content'], $x, $replacement['length']);
//        });

        return collect($days);
    }
}
