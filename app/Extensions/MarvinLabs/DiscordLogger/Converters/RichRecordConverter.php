<?php

namespace App\Extensions\MarvinLabs\DiscordLogger\Converters;

use MarvinLabs\DiscordLogger\Discord\Embed;
use MarvinLabs\DiscordLogger\Discord\Message;

class RichRecordConverter extends \MarvinLabs\DiscordLogger\Converters\RichRecordConverter
{
    protected function addMainEmbed(Message $message, array $record): void
    {
        $title = "{$record['channel']} - {$record['level_name']}";
        $description = $record['message'];

        if(in_array($record['level_name'], ['ERROR', 'CRITICAL'])) {
            $description = "```$description```";
        }

        $message->embed(Embed::make()
            ->color($this->getRecordColor($record))
            ->title($title)
            ->description($description));
    }
}
