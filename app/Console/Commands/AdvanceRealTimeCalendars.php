<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AdvanceRealTimeCalendars extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'calendars:advance';

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
        // Add listener to calendar to clear or update the next_update if they ever change the unit

        // Get all calendars with setting enabled _AND_ where next_update <= now(), each()
            // $unit = ucfirst($calendar->advanceByUnit);

            // $method = "add{$unit}"

            // $subRateMethod = "sub{$calendar->advancementRateUnit}"
            // $calendar->$method($calendar->advanceByCount * now() - now()->$subRateMethod($calendar->advancementRateUnit)) <- take into account the unit


            // $rateMethod = "add{$calendar->advancementRateUnit}"

            // $rateMethod -> 'addDay'
            // $calendar->next_update = now()->$rateMethod();
            // $calendar->save();

        return 0;
    }
}
