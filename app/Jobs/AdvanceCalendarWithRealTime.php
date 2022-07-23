<?php

namespace App\Jobs;

use App\Models\Calendar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AdvanceCalendarWithRealTime implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        public Calendar $calendar
    ){}

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
         $unit = ucfirst($this->calendar->advancement_rate_unit);

         $calendarMethod = "add{$unit}";
         $realWorldDiffMethod = "diffIn{$unit}";
         $realWorldSubMethod = "sub{$unit}";

         $unitsSinceLastUpdate = 1+ $this->calendar
                 ->advancement_next_due
                 ->$realWorldDiffMethod(
                     now()->$realWorldSubMethod(
                         $this->calendar->advancement_rate ?? 1
                     )
                 ) / $this->calendar->advancement_rate ?? 1;

         $this->calendar
             ->$calendarMethod(
                 $unitsSinceLastUpdate
             );


         $this->calendar->advancement_next_due = now()->$calendarMethod($this->calendar->advancement_rate ?? 1)->startOfMinute();
         $this->calendar->save();
         
//         logger()->channel('discord')->info("
//         ```
//{$this->calendar->name}
//
//-----------------------------
//The time is now {$this->calendar->current_time} on {$this->calendar->current_date}
//-----------------------------```
//         ");

    }
}
