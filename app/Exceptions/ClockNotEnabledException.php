<?php

namespace App\Exceptions;

use App\Models\Calendar;
use Exception;

class ClockNotEnabledException extends Exception
{
    public function __construct(Calendar $calendar)
    {
        $calendar->update([
            'advancement_enabled' => false
        ]);

        parent::__construct("Tried to advance {$calendar->name} ({$calendar->hash}) by a clock unit, but it does not have the clock enabled. Disabling to avoid repeat failures.");
    }
}
