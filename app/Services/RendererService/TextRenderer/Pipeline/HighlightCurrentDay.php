<?php


namespace App\Services\RendererService\TextRenderer\Pipeline;


use App\Services\RendererService\TextRenderer;
use App\Services\RendererService\TextRenderer\PipelinePayload;
use App\Services\RendererService\TextRenderer\WeekBottom;
use App\Services\RendererService\TextRenderer\WeekTopper;
use Closure;

class HighlightCurrentDay
{
    /**
     * @var mixed
     */
    private $weeksBody;
    private $firstLine;

    public function handle(PipelinePayload $payload, Closure $next)
    {
        return $next($this->outlineCurrentDate($payload));
    }

    private function outlineCurrentDate(PipelinePayload $payload)
    {
        $cellLength = $payload->getCellLength();
        $currentDayCellStart = $payload->getCurrentDayCol();
        $currentDayRow = $payload->getCurrentDayRow();

        dump($cellLength, $currentDayCellStart, $currentDayRow);

        $replacementGroups = collect([
            $currentDayRow - 1 => [
                [
                    'content' => TextRenderer::TOP_LEFT_DOUBLE,
                    'length' => 1,
                    'X' => -1,
                ],
                [
                    'content' => TextRenderer::SEPARATOR_HORIZONTAL_DOUBLE,
                    'length' => $cellLength,
                    'X' => 0,
                ],
                [
                    'content' => TextRenderer::TOP_RIGHT_DOUBLE,
                    'length' => 1,
                    'X' => $cellLength,
                ],
            ],
            $currentDayRow => [
                [
                    'content' => TextRenderer::SEPARATOR_VERTICAL_DOUBLE,
                    'length' => 1,
                    'X' => -1,
                ],
                [
                    'content' => TextRenderer::SEPARATOR_VERTICAL_DOUBLE,
                    'length' => 1,
                    'X' => $cellLength,
                    'Y' => 0,
                ],
            ],
            $currentDayRow + 1 => [
                [
                    'content' => TextRenderer::BOTTOM_LEFT_DOUBLE,
                    'length' => 1,
                    'X' => -1,
                ],
                [
                    'content' => TextRenderer::SEPARATOR_HORIZONTAL_DOUBLE,
                    'length' => $cellLength,
                    'X' => 0,
                ],
                [
                    'content' => TextRenderer::BOTTOM_RIGHT_DOUBLE,
                    'length' => 1,
                    'X' => $cellLength,
                ],
            ]
        ]);

        $replacementGroups->each(function($replacements, $rowToReplace) use ($payload, $currentDayCellStart){
            $line = $payload->getLine($rowToReplace)[0];

            foreach($replacements as $string) {
                $line = mb_substr_replace($line, $string['content'], $currentDayCellStart + $string['X'], $string['length']);
            }

            $payload->setLine($rowToReplace, $line);
        });

        return $payload;
    }
}
