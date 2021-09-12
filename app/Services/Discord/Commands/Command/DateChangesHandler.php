<?php


namespace App\Services\Discord\Commands\Command;


use App\Calendar;
use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;
use App\Services\Discord\Events\CalendarChildrenRequested;
use App\Services\Discord\Exceptions\DiscordCalendarLinkedException;
use App\Services\Discord\Exceptions\DiscordCalendarNotSetException;
use App\Services\RendererService\TextRenderer;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class DateChangesHandler extends Command
{
    use PremiumCommand;

    private Calendar $calendar;

    public static function signature(): string
    {
        return "add"; // Override by calling fullSignature() method instead
    }

    /**
     * All this handler does is parse user input into something usable for changing the date.
     *
     * @return Response|string
     */
    public function handle()
    {
        logger($this->called_command);
        $action = explode(' ', $this->called_command)[1];
        $unit = explode(' ', $this->called_command)[2];
        $count = $this->option(['days', 'months', 'years', 'minutes', 'hours']) ?? 1;

        if($count === 0) return $this->userWantedZeroChange($action, $unit);

        return $this->change_date($action, $unit, $count);
    }

    /**
     * Changes the current date on a calendar by moving a specific unit in a direction by an amount
     *
     * @param $action
     * @param $unit
     * @param int $count
     * @param false $update
     * @return Response|string
     * @throws DiscordCalendarLinkedException
     * @throws DiscordCalendarNotSetException
     */
    public function change_date($action, $unit, $count = 1, $update = false, $show_children = false)
    {
        $this->calendar = $this->getDefaultCalendar();

        if(!$this->user->is($this->calendar->user)) {
            return Response::make("You can only change the date on your own calendars")
                ->ephemeral();
        }

        if($this->calendar->parent()->exists()) {
            throw new DiscordCalendarLinkedException($this->calendar);
        }

        $method = $action . ucfirst(Str::plural($unit));

        if(in_array($unit, ['minute', 'hour', 'minutes', 'hours']) && !$this->calendar->clock_enabled) {
            return $this->blockQuote("Can't add {$unit} to '{$this->calendar->name}' when the clock is not enabled!");
        }

        $this->calendar
            ->$method($count)
            ->save();

        if($show_children || $this->setting('show_children')){
            logger()->debug('Showing children');
            return Response::deferred();
        }

        logger()->debug('no children to respond with');
        return $this->respondWithoutChildren($action, $unit, $count, $update);
    }

    public function respondWithoutChildren($action, $unit, $count = 1, $update = false, $addButtons = true)
    {
        $this->calendar = $this->calendar ?? $this->getDefaultCalendar();

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

        $response = Response::make($responseText);

        if($addButtons) {
            $response = $response->addRow(function(ActionRow $row) use ($action, $unit, $count, $reverse_action){
                $row = $row->addButton("$action:change_date:$reverse_action;$unit;$count;true;true", ['label' => ucfirst($reverse_action) . " $count instead", 'emoji' => ':arrow_left:'])
                           ->addButton("$action:change_date:$action;$unit;$count;true;true", ucfirst($action) ." $count more", 'success');

                if($this->calendar->children()->exists()) {
                    $row->addButton(static::target('appendChildDates'), 'Show Linked Children');
                }

                return $row;
            });
        }

        return $response;
    }

    public function respondWithChildren($action, $unit, $count = 1, $update = false)
    {
        $response = $this->respondWithoutChildren($action, $unit, $count, $update, false);

        $reverse_action = ($action == 'add')
            ? 'sub'
            : 'add';

        $response = $response->addRow(function(ActionRow $row) use ($action, $unit, $count, $reverse_action){
            return $row->addButton("$action:change_date:$reverse_action;$unit;$count;true", ['label' => ucfirst($reverse_action) . " $count instead", 'emoji' => ':arrow_left:'])
                ->addButton("$action:change_date:$action;$unit;$count;true", ucfirst($action) ." $count more", 'success')
                ->addButton(static::target('appendChildDates'), 'Show Linked Children', 'secondary', true);
        });

        if($update) {
            $response->updatesMessage();
        }

        return $response;
    }

    public function appendChildDates($response = null, $parent = null, $deferred = false)
    {
        logger(json_encode(optional($response) ?? []));
        logger("Parent: " . (optional($parent)->name ?? 'None'));
        logger("Deferred?: " . ($deferred ? "Yes" : "No"));

        if(!$response) {
            $text = strstr($this->interaction('message.content'), 'Child calendar dates:', true);

            $response = Response::make($text)
                ->addRow(function(ActionRow $row){
                    $originalButtons = $this->interaction('message.components.0.components');
                    $childrenButton = array_pop($originalButtons);

                    foreach($originalButtons as $component) {
                        $row->addButton(str_replace(config('services.discord.global_command') . ".", '', $component['custom_id']), $component['label'], $component['style']);
                    }

                    $childrenButtonStyle = array_search($childrenButton['style'], Command\Response\Component\Button::$styles);
                    $row->addButton($childrenButton['custom_id'], $childrenButton['label'], $childrenButtonStyle, true);

                    return $row;
                })
                ->updatesMessage();

            logger(json_encode($response->getMessage()));
        }

        if($deferred) $response->setType('deferred_update');



        $content = "";

        $calendar = $parent ?? $this->getDefaultCalendar();
        $minNameLength = $calendar->children->max(fn($child) => strlen($child->name));

        $children = $calendar->children->map(function($calendar) use (&$content, $minNameLength){
            return Str::padLeft($calendar->name, $minNameLength) . ' : ' . $calendar->current_date;
        })->join("\n");

        $content .= "\nChild calendar dates:" . $this->codeBlock($children);

        return $response->appendText($content);
    }

    private function userWantedZeroChange($action, $unit): Response
    {
        $calendar = $this->getDefaultCalendar();
        $currentDate = $calendar->current_date;

        $confusionMessages = [
            "It ... You want to... what?",
            "I'm not sure what you expected to happen.",
            "We're technically always doing that anyway, unless you instruct us otherwise.",
            "Congratulations! You found the easter egg. Now ... Stop it!",
            "http://i.imgur.com/VUV2KZSt.png",
            "https://i.imgur.com/XgNFgGQt.jpg",
            "http://i.imgur.com/7ygyj6nt.jpg",
            "http://i.imgur.com/XZiz9qzt.jpg",
            "http://i.imgur.com/SgUGFR1.jpg",
            "https://i.imgur.com/dMx3qg1.gif",
            "Task failed successfully! The Date is still $currentDate.",
            "It's already $currentDate! Changing that by 0 won't help you any.",
            "Character idea: A mathematician who ONLY knows how to add 0 to things.",
            "Campaign idea: The artificer BBEG keeps ordering his materials by writing in quantities of 0, enrages whole supplier population of local town.",
            "Picture this - It was $currentDate, and nobody wanted to change that. In fact, they wanted to **not** change it _so much_, the DM decided to $action 0 $unit to the current date.",
            "{$action}ing 0 $unit to $currentDate: A short walk down a windy beach leading nowhere.",
            "Right, ya ok. I can't $action 0 $unit to $currentDate. Next you'll ask me to _divide_ by 0 and we'll be stuck here forever.",
            "Listen, I know you're being chased by a dragon and all, but {$action}ing 0 {$unit} to $currentDate won't get it off your trail.\n\nIn fact, I think it wasted so much time the dragon has gotten **closer**.",
            "We didn't build a deterministic finite state machine handling text-rendering of custom calendar systems just so you could go about {$action}ing 0 {$unit} to it.",
            "Do you feel better now that you got that out of your system?",
            "You know what? I'm gonna try my best.\n\n_Hnnnng_...\n\nOh, uh. Oops. Accidentally deleted your calendar instead. (Just kidding. I deleted a random month instead. (Just kidding. I deleted a random day instead. (Just kidding. I deleted a random event instead.(Just kidding.))))",
            "PEBKAC error encountered.",
            ":x: Success",
            "Are you sure you want to delete {$calendar->name}?",
            "What did the laptop say to the dentist? My bluetooth hurts!\n\n... No, but seriously, I can't {$action} 0 {$unit} to $currentDate. It won't do anything.",
            "Fun fact: This \"I can't add 0 to the current date\" error is on line " . __LINE__ . " of the file it's in. Also the date is still $currentDate.",
        ];

        if(Str::contains($currentDate, '0')) {
            $confusionMessages[] = "Can't do that, sorry. $currentDate already has a '0' in it.";
        }

        return Response::make($this->blockQuote($this->called_command)
            . $this->newLine(2)
            . Arr::random($confusionMessages));
    }
}
