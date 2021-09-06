<?php

namespace App\Services\Discord\Exceptions;

use App\Services\Discord\Commands\Command\Response;
use Exception;

class DiscordUserInvalidException extends Exception
{
    protected $message = "You'll need to connect your Fantasy Calendar and Discord accounts to use this integration.";

    public function getResponse()
    {
        return Response::make($this->getMessage())
            ->singleButton(route('discord.index'), 'Connect your Fantasy Calendar account')
            ->ephemeral()
            ->getMessage();
    }
}
