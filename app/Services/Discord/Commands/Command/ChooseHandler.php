<?php


namespace App\Services\Discord\Commands\Command;


use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\Services\Discord\Commands\Command\Response\Component\SelectMenu;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;
use App\Services\Discord\Exceptions\DiscordUserHasNoCalendarsException;
use App\User;

class ChooseHandler extends Command
{
    use PremiumCommand;

    public static function signature(): string
    {
        return "choose";
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
        if($this->user->calendars->count() < 1) {
            throw new DiscordUserHasNoCalendarsException();
        }


        return Response::make('Select one of your calendars to be your default for this server:')
            ->ephemeral()
            ->addRow(function(ActionRow $row){
                return self::userDefaultCalendarMenu($this->user, $row, $this->getDefaultCalendar()->id);
            });
    }

    /**
     * Sets the user's default calendar for the server they're calling us from to a particular ID
     *
     * @param $id
     * @return Response
     * @throws \App\Services\Discord\Exceptions\DiscordCalendarNotSetException
     */
    public function set_default($id): Response
    {
        $this->setting('default_calendar', $id);

        return Response::make("Your default calendar for this server has been changed to " . $this->bold($this->getDefaultCalendar()->name))
            ->singleButton(HelpHandler::target('handle'), 'Yay! ...What now?')
            ->ephemeral();
    }

    /**
     * Generate an ActionRow containing a select menu for a user to choose their default calendar
     *
     * @param User $user
     * @param ActionRow $row
     * @param int|null $default
     * @return ActionRow
     */
    public static function userDefaultCalendarMenu(User $user, ActionRow $row, int $default = null): ActionRow
    {
        logger('Default is ' . $default);
        return $row->addSelectMenu(function(SelectMenu $menu) use ($user, $default) {
            $user->calendars->each(function($calendar) use (&$menu, $default){
                $menu->addOption(
                    $calendar->name, $calendar->id,
                    "A calendar with {$calendar->events()->count()} events.",
                    null,
                    $calendar->id === $default
                );
            });

            return $menu;
        }, self::target('set_default'), 'Choose one of your calendars');
    }
}
