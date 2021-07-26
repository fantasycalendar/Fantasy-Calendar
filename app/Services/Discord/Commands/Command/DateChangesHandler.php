<?php


namespace App\Services\Discord\Commands\Command;


use App\Calendar;
use App\Services\Discord\Commands\Command;
use App\Services\RendererService\TextRenderer;
use Illuminate\Support\Str;

class DateChangesHandler extends Command
{

    private Calendar $calendar;

    public function handle(): string
    {
        $this->calendar = $this->getDefaultCalendar();
        $action = explode(' ', $this->called_command)[2];
        $count = $this->option(['days', 'months', 'years', 'minutes', 'hours']) ?? 1;

        $this->$action($count);

        $response = ($count)
            ? $count . " " . Str::plural($action, $count)
            : '1 ' . $action;

        return $response . " added!" . $this->newLine(2) . $this->codeBlock(TextRenderer::renderMonth($this->getDefaultCalendar()));
    }

    public function __call($name, $arguments)
    {
        // addDays, etc.
        $method = 'add' . ucfirst(Str::plural($name));

        $this->calendar
            ->$method($arguments[0])
            ->save();
    }
}
