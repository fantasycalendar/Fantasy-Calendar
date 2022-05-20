<?php

namespace App\Services\Discord\Exceptions;

use App\Models\Calendar;
use App\Services\Discord\Commands\Command\Response;
use Throwable;

class DiscordCalendarLinkedException extends DiscordException
{
    public function __construct(Calendar $calendar, $message = null, $code = 0, Throwable $previous = null)
    {
        $this->calendar = $calendar;

        parent::__construct($message, $code, $previous);
    }

    public function makeResponse($message)
    {
        return Response::make("This calendar follows the date of {$this->calendar->parent->name}. You'll need to change that one instead.")
                ->singleButton(route('calendars.show', $this->calendar->parent), $this->calendar->parent->name . ' on ' . config('app.name'));
    }
}
