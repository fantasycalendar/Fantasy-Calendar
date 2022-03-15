<?php


namespace App\Services\Discord\Commands\Command\Create;


use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\Services\Discord\Commands\Command\Response\Component\SelectMenu;
use App\Services\Discord\Commands\Command\Response\Modal;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;
use App\Services\Discord\Exceptions\DiscordUserHasNoCalendarsException;
use App\User;

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
    public function handle(): Modal
    {
        ld($this->interaction_user_id);
        return Modal::create(
            'Enter your event title',
            self::target('reEcho')
        )
            ->addRow(function(ActionRow $row){
                return $row->addTextInput(
                    self::target('reEcho'),
                    'Event title',
                    'Event title'
                );
            })->addRow(function(ActionRow $row){
                return $row->addTextInput(
                    self::target('reEcho2'),
                    'Event Description',
                    'Today my players were a pain by...',
                    false,
                    0,
                    1000,
                    2
                );
            });
    }

    public function reEcho($response) {
        return Response::make($this->interaction('data.components.0.components.0.value'));
    }
}
