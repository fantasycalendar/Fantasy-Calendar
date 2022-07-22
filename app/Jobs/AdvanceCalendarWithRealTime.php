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
        logger()->info('We would have advanced ' . $this->calendar->name);
        // $unit = ucfirst($calendar->advanceByUnit);

        // $method = "add{$unit}"

        // $subRateMethod = "sub{$calendar->advancementRateUnit}"
        // $calendar->$method($calendar->advanceByCount * now() - now()->$subRateMethod($calendar->advancementRateUnit)) <- take into account the unit


        // $rateMethod = "add{$calendar->advancementRateUnit}"

        // $rateMethod -> 'addDay'
        // $calendar->next_update = now()->$rateMethod();
        // $calendar->save();

    }
}
