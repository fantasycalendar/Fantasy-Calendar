<?php

namespace App\Services\Discord\Exceptions;

use App\Services\Discord\Commands\Command\Response;

class DiscordUserInvalidException extends DiscordException
{
    protected $defaultMessage = "You'll need to be a paid subscriber _(only $2.49/month!)_ on Fantasy Calendar and connect your Discord account to use this integration.";

    protected function makeResponse($message): Response
    {
        return Response::make($message)
            ->singleButton(route('discord.index'), 'Subscribe and connect your Fantasy Calendar account today!')
            ->ephemeral();
    }
}
