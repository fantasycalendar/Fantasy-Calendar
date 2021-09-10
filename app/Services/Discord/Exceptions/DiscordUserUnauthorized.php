<?php

namespace App\Services\Discord\Exceptions;

use App\Services\Discord\Commands\Command\Response;

class DiscordUserUnauthorized extends DiscordException
{
    protected $defaultMessage = "You are not authorized to perform that action.";

    public function makeResponse($message)
    {
        return Response::make($message)->ephemeral();
    }
}
