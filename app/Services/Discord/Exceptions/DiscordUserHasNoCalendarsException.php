<?php

namespace App\Services\Discord\Exceptions;

use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Commands\Command\Response\Component\ActionRow;
use Throwable;

class DiscordUserHasNoCalendarsException extends DiscordException
{
    public $defaultMessage = "Uh oh ... You don't have any calendars!\n\n You'll need to create at least one before you can use this integration:";

    public function __construct($message = "", $code = 0, Throwable $previous = null)
    {
        $message = empty($message)
            ? $this->defaultMessage
            : $message;

        parent::__construct($message, $code, $previous);
    }

    public function getResponse(): Response
    {
        return Response::make("Uh oh ... You don't have any calendars!\n\n You'll need to create at least one before you can use this integration:")
            ->ephemeral()
            ->addRow(function(ActionRow $row){
                return $row->addButton(route('calendars.create'), 'Create a Calendar');
            });
    }
}
