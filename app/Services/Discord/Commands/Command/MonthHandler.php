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
        return $this->codeBlock(TextRenderer::renderMonth($this->getDefaultCalendar()));
    }
}
