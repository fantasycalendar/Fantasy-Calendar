<?php


namespace App\Services\Discord\Commands\Command;

use App\Services\Discord\Commands\Command;
use App\Services\Discord\Commands\Command\Response\Component\ActionRow;

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

    public function handle(): Response
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

        if(!$this->setting('default_calendar')) {
            $responseText .= $this->newLine(1) . $this->bold('The first thing') . " you should do is set a default calendar:";
        }

        $response = Response::make($responseText)
            ->ephemeral();

        if(!$this->setting('default_calendar')) {
            $response->addRow(function(ActionRow $row) {
                return ListHandler::userDefaultCalendarMenu($this->user, $row);
            });
        }

        return $response;
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
}
