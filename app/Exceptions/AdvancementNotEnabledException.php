<?php

namespace App\Exceptions;

use App\Models\Calendar;
use Exception;

class AdvancementNotEnabledException extends Exception
{
    public function __construct(Calendar $calendar)
    {
        $message = "Tried to advance {$calendar->name} ({$calendar->hash}), but it does not appear to actually have advancement enabled.";

        parent::__construct($message);
    }
}
