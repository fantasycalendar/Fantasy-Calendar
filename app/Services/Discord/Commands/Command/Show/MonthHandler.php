<?php


namespace App\Services\Discord\Commands\Command\Show;


use App\Services\Discord\Exceptions\DiscordCalendarNotSetException;
use App\Services\Discord\Commands\Command;
use App\Services\RendererService\TextRenderer;

class MonthHandler extends Command
{
    /**
     * Generate a
     *
     * @return string
     * @throws DiscordCalendarNotSetException
     */
    public function handle(): string
    {
        return $this->codeBlock(TextRenderer::renderMonth($this->getDefaultCalendar()));
    }
}
