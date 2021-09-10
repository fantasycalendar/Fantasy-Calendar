<?php


namespace App\Services\Discord\Commands\Command;


use App\Calendar;
use App\Facades\Epoch;
use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;
use App\Services\RendererService\TextRenderer;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class DateChangesHandler extends Command
{
    use PremiumCommand;

    private Calendar $calendar;

    public static function signature(): string
    {
        return "add"; // Override by calling fullSignature() method instead
    }

    public function handle()
    {
        $action = explode(' ', $this->called_command)[1];
        $unit = explode(' ', $this->called_command)[2];
        $count = $this->option(['days', 'months', 'years', 'minutes', 'hours']) ?? 1;

        if($count === 0) return $this->codeBlock($this->called_command . " 0") . $this->newLine() . "It ... You want to... what?";

        return $this->change_date($action, $unit, $count);
    }

    public function change_date($action, $unit, $count = 1, $update = false)
    {
        $this->calendar = $this->getDefaultCalendar();

        if(!$this->user->is($this->calendar->user)) {
            return Response::make("You can only change the date on your own calendars")
                ->ephemeral();
        }

        $method = $action . ucfirst(Str::plural($unit));

        if(in_array($unit, ['minute', 'hour', 'minutes', 'hours']) && !$this->calendar->clock_enabled) {
            return $this->blockQuote("Can't add {$unit} to '{$this->calendar->name}' when the clock is not enabled!");
        }

        $this->calendar
            ->$method($count)
            ->save();

        $number_units = ($count !== 1)
            ? $count . " " . $unit
            : '1 ' . Str::singular($unit);

        $past_verb = ($action == 'add')
            ? 'added'
            : 'subtracted';

        $current_time = ($this->calendar->clock_enabled && !$this->calendar->setting('hide_clock'))
            ? "Current time: ". $this->calendar->current_time
            : "";

        $responseText = $this->blockQuote("$number_units $past_verb!")
            . $this->newLine(2)
            . $current_time
            . $this->codeBlock(TextRenderer::renderMonth($this->calendar));

        $reverse_action = ($action == 'add')
            ? 'sub'
            : 'add';

        $response = Response::make($responseText)
            ->addRow(function(ActionRow $row) use ($action, $unit, $count, $reverse_action){
                return $row->addButton("$action:change_date:$reverse_action;$unit;$count;true", ['label' => 'Undo', 'emoji' => ':arrow_left:'])
                           ->addButton("$action:change_date:$action;$unit;$count;true", 'Again', 'success');
            });

        if($update) {
            $response->updatesMessage();
        }

        return $response;
    }
}
