<?php

namespace App\Services\Discord\Exceptions;

use App\Services\Discord\Commands\Command\Response;

class DiscordUserInvalidException extends DiscordException
{
    protected $message = "You'll need to be a paid subscriber _(only $2.49/month!)_ on Fantasy Calendar and connect your Discord account to use this integration.";

    public function getResponse(): Response
    {
        return Response::make($this->getMessage())
            ->singleButton(route('discord.index'), 'Subscribe and connect your Fantasy Calendar account today!')
            ->ephemeral();
    }
}
