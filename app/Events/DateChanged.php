<?php

namespace App\Events;

use App\Calendar;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DateChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $targetEpoch;
    public Calendar $calendar;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Calendar $calendar, int $targetEpoch)
    {
        $this->calendar = $calendar;
        $this->targetEpoch = $targetEpoch;
    }
}
