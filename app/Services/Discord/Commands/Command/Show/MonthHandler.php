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
    public function handle(): string
    {
        logger('MonthHandler::handle entered');
        $this->calendar = $this->getDefaultCalendar();
        logger($this->calendar->name);


        $current_time = ($this->calendar->clock_enabled && !$this->calendar->setting('hide_clock'))
            ? "Current time: ". $this->calendar->current_time
            : "";

        logger($current_time);

        $month = TextRenderer::renderMonth($this->calendar);

        $response = $current_time . $this->codeBlock($month);

        logger(strlen($response));

        return $current_time . $this->codeBlock($month);
    }
}
