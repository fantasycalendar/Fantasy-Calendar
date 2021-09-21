<?php

namespace App\Services\Discord\Exceptions;

use App\Services\Discord\Commands\Command\Response;

class DiscordResponseTooLongException extends DiscordException
{
    protected $defaultMessage = "Hmm, it looks like that would have generated a response that is too long for Discord.";

    public function makeResponse($message)
    {
        return ($message instanceof Response)
            ? $message
            : Response::make($message)->ephemeral();
    }
}
