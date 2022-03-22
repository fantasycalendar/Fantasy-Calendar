<?php


namespace App\Services\Discord\Commands\Command\Create;


use App\CalendarEvent;
use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\Services\Discord\Commands\Command\Response\Component\SelectMenu;
use App\Services\Discord\Commands\Command\Response\Modal;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;
use App\Services\Discord\Exceptions\DiscordUserHasNoCalendarsException;
use App\User;
use Mews\Purifier\Facades\Purifier;

class EventHandler extends Command
{
    use PremiumCommand;

    public static function signature(): string
    {
        return "create event";
    }

    /**
     * Provides user with a menu to choose their calendar for the server in question
     *
     * @return Response
     * @throws DiscordUserHasNoCalendarsException
     * @throws \App\Services\Discord\Exceptions\DiscordCalendarNotSetException
     */
    public function handle(): Response
    {
        if($title = $this->interaction('data.options.0.options.0.options.0.value')) {
            $calendar = $this->getDefaultCalendar();
            $event = $calendar->oneTimeEvent($title);

            return Response::make(
                "Created one-time event **{$event->name}** on **{$calendar->current_date}**."
            );
        }

        return Modal::create(
            'Enter your event title',
            self::target('createEvent')
        )
            ->addRow(function(ActionRow $row){
                return $row->addTextInput(
                    'event_title',
                    'Event title',
                    'Event title'
                );
            })->addRow(function(ActionRow $row){
                return $row->addTextInput(
                    'event_description',
                    'Event Description',
                    'Today my players were a pain by...',
                    false,
                    0,
                    1000,
                    2
                );
            });
    }

    public function createEvent() {
        $title = $this->interaction('data.components.0.components.0.value');
        $description = $this->interaction('data.components.1.components.0.value');

        $calendar = $this->getDefaultCalendar();
        $event = $calendar->oneTimeEvent($title, $description);

        return Response::make(
            "Created one-time event **{$event->name}** on **{$calendar->current_date}**."
        );
    }
}
