<?php

namespace App\Services\Discord\Exceptions;

use App\Services\Discord\Commands\Command\ChooseHandler;
use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use App\Models\User;
use Throwable;

class DiscordCalendarNotSetException extends DiscordException
{
    private User $user;
    public $defaultMessage = "You'll need to pick one of your calendars to run that command.";

    public function __construct($user, $message = null, $code = 0, Throwable $previous = null)
    {
        $this->user = $user;

        parent::__construct($message, $code, $previous);
    }

    protected function makeResponse($message): Response
    {
        return ($message instanceof Response)
            ? $message
            : Response::make($message)
            ->addRow(function(ActionRow $row) {
                return ChooseHandler::userDefaultCalendarMenu($this->user, $row);
            })
            ->ephemeral();
    }
}
