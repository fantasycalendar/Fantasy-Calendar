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

        $action = explode(' ', $this->called_command)[1];
        $unit = ucfirst(Str::plural(explode(' ', $this->called_command)[2]));
        $count = $this->option(['days', 'months', 'years', 'minutes', 'hours']) ?? 1;

        $method = $action . $unit;

        $this->calendar
            ->$method($count)
            ->save();

        $response = ($count)
            ? $count . " " . Str::plural($action, $count)
            : '1 ' . $action;

        return $this->blockQuote($response . " added!")
             . $this->newLine(2)
             . $this->codeBlock(TextRenderer::renderMonth($this->getDefaultCalendar()));
    }
}
