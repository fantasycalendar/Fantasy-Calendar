<?php


namespace App\Services\Discord\Commands\Command\Show;


use App\Services\Discord\Commands\Command;
use App\Services\RendererService\TextRenderer;

class MonthHandler extends Command
{
    /*
     * This gets called by the discord hook, and returns a string containing an entire calendar
     */
    public function handle(): string
    {
        return $this->codeBlock(TextRenderer::renderMonth($this->getDefaultCalendar()));
    }
}
