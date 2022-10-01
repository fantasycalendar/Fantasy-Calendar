<?php

namespace App\Console\Commands;

use App\Jobs\AdvanceCalendarWithRealTime;
use App\Models\Calendar;
use Illuminate\Console\Command;

class AdvanceRealTimeCalendars extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'calendar:advance';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Advances calendars in real-time on a schedule';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // TODO: Add listener to calendar to clear or update the next_update if they ever change the unit

        Calendar::dueForAdvancement()->each(function(Calendar $calendar){
            AdvanceCalendarWithRealTime::dispatch($calendar);
        });

        return 0;
    }
}
