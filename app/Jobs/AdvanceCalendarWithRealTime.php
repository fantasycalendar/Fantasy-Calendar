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

         logger()->info($unit);

         $method = "add{$unit}";
         $diffMethod = "diffIn{$unit}";

         $subRateMethod = "sub{$unit}";

         logger()->info($this->calendar->current_date);

         dump(
             $method,
             $diffMethod,
             $subRateMethod,
             $this->calendar->advancement_rate,
             now()->$subRateMethod($this->calendar->advancement_rate ?? 1),
             $this->calendar->advancement_next_due->$diffMethod(now()->$subRateMethod($this->calendar->advancement_rate)) / $this->calendar->advancement_rate
         );

         $this->calendar->$method(now()->$diffMethod(now()->$subRateMethod($this->calendar->advancement_rate)) / $this->calendar->advancement_rate);

         logger()->info($this->calendar->current_date);


        // $rateMethod = "add{$this->calendar->advancement_rate_unit}"

        // $rateMethod -> 'addDay'
        // $this->calendar->next_update = now()->$rateMethod();
        // $this->calendar->save();

    }
}
