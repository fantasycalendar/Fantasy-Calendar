<?php


namespace App\Services\Discord\Commands\Command\Show;


use App\Calendar;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;
use App\Services\Discord\Exceptions\DiscordCalendarNotSetException;
use App\Services\Discord\Commands\Command;
use App\Services\RendererService\TextRenderer;

class MonthHandler extends Command
{
    use PremiumCommand;

    private Calendar $calendar;

    /**
     * Generate a
     *
     * @return string
     * @throws DiscordCalendarNotSetException
     */
    public function handle(): string
    {
        $this->calendar = $this->getDefaultCalendar();

        $current_time = ($this->calendar->clock_enabled && !$this->calendar->setting('hide_clock'))
            ? "Current time: ". $this->calendar->current_time
            : "";

        return $current_time . $this->codeBlock(TextRenderer::renderMonth($this->calendar));
    }
}
