<?php


namespace App\Services\Discord\Commands\Command;


use App\Calendar;
use App\Facades\Epoch;
use App\Services\Discord\Commands\Command;
use App\Services\RendererService\TextRenderer;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class DateChangesHandler extends Command
{

    private Calendar $calendar;

    public function handle(): string
    {
        $this->calendar = $this->getDefaultCalendar();

        $action = explode(' ', $this->called_command)[1];
        $unit = explode(' ', $this->called_command)[2];
        $count = $this->option(['days', 'months', 'years', 'minutes', 'hours']) ?? 1;

        if($count === 0) return $this->codeBlock($this->called_command . " 0") . $this->newLine() . "It ... You want to... what?";

        $method = $action . ucfirst(Str::plural($unit));

        $this->calendar
            ->$method($count)
            ->save();

        $response = ($count !== 1)
            ? $count . " " . $unit
            : '1 ' . Str::singular($unit);

        $verb = ($action == 'add')
            ? 'added'
            : 'subtracted';

        return $this->blockQuote("$response $verb!")
             . $this->newLine(2)
             . $this->codeBlock(TextRenderer::renderMonth($this->calendar));
    }
}
