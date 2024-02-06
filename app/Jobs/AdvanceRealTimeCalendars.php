<?php

namespace App\Jobs;

use App\Models\Calendar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\Middleware\RateLimitedWithRedis;

class AdvanceRealTimeCalendars implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function middleware()
    {
        return [(new RateLimitedWithRedis('advancement'))->dontRelease()];
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Calendar::dueForAdvancement()->each(function(Calendar $calendar){
            logger()->debug("Advancing {$calendar->name}");
            AdvanceCalendarWithRealTime::dispatch($calendar);
        });
    }
}
