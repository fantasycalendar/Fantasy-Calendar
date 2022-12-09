<?php

namespace App\Exceptions;

use App\Models\Calendar;
use Exception;

class AdvancementNotReadyException extends Exception
{
    public function __construct(Calendar $calendar)
    {
        $calendar->update([
            'advancement_enabled' => false
        ]);

        parent::__construct("Tried to advance {$calendar->name} ({$calendar->hash}), but it is not fully setup for advancement. Disabling to avoid repeat failures.");
    }
}
