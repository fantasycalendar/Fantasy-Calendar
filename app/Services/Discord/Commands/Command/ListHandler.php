<?php


namespace App\Services\Discord\Commands\Command;


use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\Services\Discord\Commands\Command\Response\Component\SelectMenu;
use App\Services\Discord\Commands\Command\Traits\PremiumCommand;

class ListHandler extends Command
{
    use PremiumCommand;

    public function handle(): Response
    {
        if($this->user->calendars->count() < 1) {
            return Response::make("You don't have any calendars! You'll need to create at least one:")
                ->ephemeral()
                ->addRow(function(ActionRow $row){
                    return $row->addButton(route('calendars.create'), 'Create a Calendar');
                });
        }


        return Response::make('Select one of your calendars to be your default for this server:')
            ->ephemeral()
            ->addRow(function(ActionRow $row){
                return $row->addSelectMenu(function(SelectMenu $menu){
                    $this->user->calendars->each(function($calendar) use (&$menu){
                        $menu->addOption(
                            $calendar->name, $calendar->id,
                            "A calendar with {$calendar->events()->count()} events."
                        );
                    });

                    return $menu;
                }, 'list:set_default', 'Choose one of your calendars');
            });
    }

    public function set_default($id)
    {
        $this->setting('default_calendar', $id);

        return Response::make("Your default calendar for this server has been changed to " . $this->bold($this->getDefaultCalendar()->name))
            ->ephemeral();
    }
}
