<?php

namespace App\Events;

use App\Calendar;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DateChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $epoch;
    public bool $clockEnabled;
    public int $minutesPerDay;
    public Calendar $calendar;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Calendar $calendar, int $epoch, bool $clockEnabled, int $minutesPerDay = 0)
    {
        $this->calendar = $calendar;
        $this->epoch = $epoch;
        $this->clockEnabled = $clockEnabled;
        $this->minutesPerDay = $minutesPerDay;
    }
}
