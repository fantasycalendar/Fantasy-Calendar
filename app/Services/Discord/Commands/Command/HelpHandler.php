<?php


namespace App\Services\Discord\Commands\Command;

use App\Services\CalendarService\Month;
use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\Services\Discord\Commands\Command\Show\DateHandler;
use App\Services\Discord\Commands\Command\Show\MonthHandler;

class HelpHandler extends Command
{
    use Command\Traits\PremiumCommand;

    public const TYPES = [
        1 => 'subcommand',
        2 => 'subcommand_group',
        3 => 'string',
        4 => 'integer',
        5 => 'boolean',
        6 => 'user',
        7 => 'channel',
        8 => 'role',
        9 => 'mentionable'
    ];

    public static function signature(): string
    {
        return 'help';
    }

    /**
     * Does the heavy lifting
     *
     * @return Response
     */
    public function handle(): Response
    {
        // Create our initial response
        $response = $this->buildInitialHelp();

        // User has no calendars
        if(!$this->user->calendars()->count()) {
            return $this->noCalendars($response);
        }

        // User needs to set a default calendar
        if(!$this->setting('default_calendar') || !$this->user->hasCalendar($this->setting('default_calendar'))) {
            return $this->needsDefaultCalendarSet($response);
        }

        // Success! User is all setup.
        return $this->success($response);
    }

    /**
     * Formats a Discord-formatting
     *
     * @param array $command
     * @param int $level
     * @return string
     * @throws \Exception
     */
    public static function formatOption(array $command, int $level = 1): string
    {
        $indentation = str_repeat(' ', 2 * $level);
        $baseCommandString = $indentation . "- {$command['name']}: {$command['description']}\n";

        if(!array_key_exists("options", $command)) return $baseCommandString;

        switch (static::typeName($command['type'])) {
            case 'subcommand':
                return $baseCommandString;
            case 'subcommand_group':
                return $baseCommandString . $indentation . "    subcommands: {" . implode(',', array_map(function($option){ return $option['name']; }, $command['options'])) . "}\n";
        }

        return "";
    }

    /**
     * @param $typeInteger
     * @return string
     * @throws \Exception
     */
    public static function typeName($typeInteger): string
    {
        if(!array_key_exists($typeInteger, self::TYPES)) throw new \Exception("Invalid type detected in command definition!");

        return self::TYPES[$typeInteger];
    }

    private function buildInitialHelp()
    {
        $commands = collect(config('services.discord.global_commands'));

        $responseText = $commands->map(function($command){
            $formatted = "/{$command['name']}\n";

            foreach($command['options'] as $option) {
                $formatted .= self::formatOption($option);
            }

            return $formatted;
        })->join("\n");

        $responseText = $this->codeBlock($responseText);

        return Response::make($responseText)
            ->ephemeral();
    }

    private function noCalendars($response)
    {
        return $response
            ->appendText($this->newLine() . "Before you can do any of that, you'll need to create a calendar:")
            ->singleButton(route('calendars.create'), 'Create a Calendar');
    }

    private function needsDefaultCalendarSet($response)
    {
        return $response
            ->appendText($this->newLine(1) . $this->bold('The first thing') . " you should do is set a default calendar:")
            ->addRow(function(ActionRow $row) {
                return ChooseHandler::userDefaultCalendarMenu($this->user, $row, $this->setting('default_calendar'));
            });
    }

    private function success($response)
    {
        return $response
            ->appendText($this->newLine() . "Give something a try!:")
            ->addRow(function(ActionRow $row) {
                return $row->addButton(MonthHandler::target(), MonthHandler::fullSignature(), 'primary')
                    ->addButton(DateHandler::target(), DateHandler::fullSignature(), 'primary')
                    ->addButton(DateChangesHandler::target('change_date', ['action' => 'sub', 'unit' => 'day']), DateChangesHandler::fullSignature('sub day'))
                    ->addButton(DateChangesHandler::target('change_date', ['action' => 'add', 'unit' => 'day']), DateChangesHandler::fullSignature('add day'))
                    ->addButton(DateChangesHandler::target('change_date', ['action' => 'add', 'unit' => 'days', 'count' => 5]), DateChangesHandler::fullSignature('add days 5'));
            });
    }
}
