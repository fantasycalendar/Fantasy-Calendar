<?php

namespace App\Services\Discord\Exceptions;

use App\Services\Discord\Commands\Command\ChooseHandler;
use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\User;
use Throwable;

class DiscordCalendarNotSetException extends DiscordException
{
    private User $user;

    public function __construct($user, Response $message = null, $code = 0, Throwable $previous = null)
    {
        $this->user = $user;

        parent::__construct($message, $code, $previous);
    }

    private function makeResponse($message): Response
    {
        return Response::make($message)
            ->addRow(function(ActionRow $row) {
                return ChooseHandler::userDefaultCalendarMenu($this->user, $row);
            })
            ->ephemeral();
    }
}
