<?php

namespace App\Services\Discord\Exceptions;

use App\Services\Discord\Commands\Command\ListHandler;
use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\User;
use Exception;
use Throwable;

class DiscordCalendarNotSetException extends Exception
{
    private User $user;
    protected $message = "You'll need to choose a calendar for this server before you can do that.";

    public function __construct($user, $message = null, $code = 0, Throwable $previous = null)
    {
        $message = $message ?? $this->message;

        $this->user = $user;
        logger()->debug("Got here with ");
        logger()->debug(json_encode($user->toArray()));
        logger()->debug($this->message);

        parent::__construct($message, $code, $previous);
    }

    public function getResponse(): array
    {
        return Response::make($this->getMessage())
            ->addRow(function(ActionRow $row) {
                return ListHandler::userDefaultCalendarMenu($this->user, $row);
            })
            ->ephemeral()
            ->getMessage();
    }
}
