<?php

namespace App\Exceptions;

use App\Models\Calendar;
use Exception;

class AdvancementTooEarlyException extends Exception
{
    public function __construct(Calendar $calendar)
    {
        parent::__construct("Tried to advance {$calendar->name} ({$calendar->hash}), but it's too early.");
    }
}
