<?php


namespace App\Services\Discord\Commands\Command;


use App\Calendar;
use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;
use App\Services\Discord\Events\CalendarChildrenRequested;
use App\Services\Discord\Exceptions\DiscordCalendarLinkedException;
use App\Services\Discord\Exceptions\DiscordCalendarNotSetException;
use App\Services\Discord\Exceptions\DiscordException;
use App\Services\Discord\Exceptions\DiscordUserUnauthorized;
use App\Services\Discord\Jobs\PrewarmDayImageCache;
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
        $action = $this->getAction();
        $unit = $this->getUnit();
        $count = $this->getCount();

        if($count === 0) return $this->userWantedZeroChange($action, $unit);

        return $this->change_date($action, $unit, $count);
    }

    public function getAction()
    {
        return explode(' ', $this->called_command)[1]
            ?? $this->componentArgument(0);
    }

    public function getUnit()
    {
        return explode(' ', $this->called_command)[2]
            ?? $this->componentArgument(1);
    }

    public function getCount()
    {
        return $this->option(['days', 'months', 'years', 'minutes', 'hours'])
            ?? $this->componentArgument(2)
            ?? 1;
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

        $this->sanityCheck();

        $method = $action . ucfirst(Str::plural($unit));

        $this->calendar
            ->$method($count);

        if($this->setting('show_children') === $this->calendar->id){
            logger()->debug('Showing children');

            $this->discord_interaction->update([
                'needs_follow_up' => true
            ]);

            $this->calendar->save();

            return Response::deferred();
        }

        logger()->debug('no children to respond with');
        $response = $this->respondWithoutChildren($action, $unit, $count, $update);

        if($update) {
            $response->updatesMessage();
        }

        $this->calendar->save();

        if($unit == 'day' && $count == 1) {
            PrewarmDayImageCache::dispatch($this->calendar, $action);
        }

        return $response;
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

        $responseText = $this->blockQuote("$number_units $past_verb!")
            . $this->newLine(2);

        $response = $this->renderMonth($this->calendar)->prependText($responseText);

        $this->addButtons($response);

        if($update) {
            $response->updatesMessage();
        }

        return $response;
    }

    public function respondWithChildren($action = null, $unit = null, $count = null, $update = false, $followup = false)
    {
        $action = $action ?? $this->getAction();
        $unit = $unit ?? $this->getUnit();
        $count = $count ?? $this->getCount();

        $response = $this->respondWithoutChildren($action, $unit, $count, $update, false);

        if($update) {
            $response->updatesMessage();
        }

        return $this->appendChildDates($response);
    }

    public function appendChildDates($response = null, $parent = null, $deferred = false)
    {
        $this->calendar = $parent ?? $this->getDefaultCalendar();
        $this->setting('show_children', $this->calendar->id);

        if(!$response) {
            $response = $this->renderMonth($this->calendar)
                ->updatesMessage();

            logger(json_encode($response->getMessage()));
        }

        $response->clearComponents();
        $response = $this->addButtons($response);

        if($deferred) $response->setType('deferred_update');

        return $response->appendText("\nChild calendar dates:" . $this->codeBlock($this->formatChildren($this->calendar)));
    }

    public function removeChildDates($action = null, $unit = null, $count = null, $update = false)
    {
        $message = Str::before($this->discord_interaction->message_text, 'Child calendar dates:');
        $this->calendar = $this->getDefaultCalendar();
        $this->setting('show_children', false);
        $response = Response::make($message)
            ->updatesMessage();

        return $this->addButtons($response);
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
            "https://i.imgur.com/SgUGFR1.jpg",
            "https://i.imgur.com/dMx3qg1.gif",
            "https://c.tenor.com/iRRAJt3llV4AAAAC/its-time-to-stop-stop.gif",
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

        $chosen = Arr::random($confusionMessages);

        $response = Response::make($this->blockQuote($this->called_command) . $this->newLine(2) . $chosen);

        if(Str::startsWith($chosen, 'https://')) {
            return $response->embedMedia($chosen);
        }

        return $response;
    }

    /**
     * Verify a handful of things before allowing the user to change things.
     *
     * @throws DiscordCalendarLinkedException
     * @throws DiscordUserUnauthorized
     */
    protected function sanityCheck()
    {
        if(!$this->user->is($this->calendar->user)) {
            throw new DiscordUserUnauthorized("You can only change the date on your own calendars");
        }

        if($this->calendar->parent()->exists()) {
            throw new DiscordCalendarLinkedException($this->calendar);
        }

        if(in_array($this->getUnit(), ['minute', 'hour', 'minutes', 'hours']) && !$this->calendar->clock_enabled) {
            throw new DiscordException($this->blockQuote("Can't add {$this->getUnit()} to '{$this->calendar->name}' when the clock is not enabled!"));
        }
    }

    /**
     * Helper to determine reverse of an action
     *
     * @param $action
     * @return string
     */
    protected function reverseAction($action): string
    {
        return ($action == 'add')
            ? 'sub'
            : 'add';
    }

    protected function formatChildren($parent): string
    {
        $minNameLength = $parent->children->max(fn($child) => strlen($child->name));

        return $parent->children->map(function($calendar) use (&$content, $minNameLength){
            return Str::padLeft($calendar->name, $minNameLength) . ' : ' . $calendar->current_date;
        })->join("\n");
    }

    protected function addButtons(Response $response): Response
    {
        if($response->hasComponents()) return $response;

        $action = $this->getAction();
        $reverse_action = $this->reverseAction($action);
        $unit = $this->getUnit();
        $count = $this->getCount();

        logger()->debug(json_encode(compact('action', 'reverse_action', 'unit', 'count')));

        return $response->addRow(function(ActionRow $row) use ($action, $reverse_action, $unit, $count){
            $row = $row->addButton("$action:change_date:$reverse_action;$unit;$count;true", ucfirst($reverse_action) . " $count instead")
                       ->addButton("$action:change_date:$action;$unit;$count;true", ucfirst($action) ." $count more", 'success');

            if($this->calendar->children()->exists()) {
                $show_children = ($this->setting('show_children') == $this->calendar->id);
                $method = ($show_children)
                    ? 'removeChildDates'
                    : 'respondWithChildren';

                $label = 'Show Linked Children';
                if($show_children) {
                    $label = "Don't " . $label;
                }

                $row->addButton(static::target($method, [$action, $unit, $count, true]), $label);
            }

            return $row;
        });
    }

    private function renderMonth($calendar): Response
    {
        return Command\Show\MonthHandler::respondWith($this->setting('renderer') ?? 'image', $calendar);
    }
}
