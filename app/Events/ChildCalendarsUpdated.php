<?php

namespace App\Events;

use App\Models\Calendar;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Bus\Batch;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChildCalendarsUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Batch $batch;
    public Calendar $calendar;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Batch $batch, Calendar $calendar)
    {
        $this->batch = $batch;
        $this->calendar = $calendar;
        logger()->debug("ChildCalendarsUpdated fired at the end of {$batch->id}!");
    }
}
