<?php


namespace App\Services\Discord\Commands\Command;


use App\Services\RendererService\MonthRenderer;

class ShowCommand extends \App\Services\Discord\Commands\Command
{

    public function handle(): string
    {
        $renderedJson = new MonthRenderer($this->getDefaultCalendar());

        return $this->blockQuote($renderedJson);
    }
}
