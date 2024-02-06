<?php

namespace App\Console\Commands;

use App\Jobs\AdvanceCalendarWithRealTime;
use App\Jobs\AdvanceRealTimeCalendars as AdvanceRealTimeCalendarsJob;
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
        AdvanceRealTimeCalendarsJob::dispatch();

        return 0;
    }
}
