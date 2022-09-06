<?php

namespace App\Jobs;

use App\Models\Calendar;
use App\Services\Discord\API\Client;
use Illuminate\Bus\Queueable;
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
        $real_unit = ucfirst($this->calendar->advancement_real_rate_unit);

        $realWorldMethod = "add{$real_unit}";
        $realWorldDiffMethod = "diffIn{$real_unit}";
        $realWorldSubMethod = "sub{$real_unit}";

        if(!$this->calendar->advancement_next_due) {
            $this->calendar->advancement_next_due = now()->startOfMinute();
        }

        $unitsSinceLastUpdate = 1 + $this->calendar
                ->advancement_next_due
                ->$realWorldDiffMethod(
                    now()->$realWorldSubMethod(
                        $this->calendar->advancement_real_rate ?? 1
                    )
                ) / $this->calendar->advancement_real_rate ?? 1;

        $calendar_unit = ucfirst($this->calendar->advancement_rate_unit);
        $calendarMethod = "add{$calendar_unit}";

        $this->calendar
            ->$calendarMethod(
                $unitsSinceLastUpdate
            );

        $this->calendar->advancement_next_due = now()->$realWorldMethod($this->calendar->advancement_real_rate ?? 1)->startOfMinute();
        $this->calendar->save();

        if($this->calendar->advancement_webhook_url) {
            HitCalendarUpdateWebhook::dispatch($this->calendar);
        }
    }
}
