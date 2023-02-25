<?php

namespace App\Jobs;

use App\Exceptions\AdvancementNotEnabledException;
use App\Exceptions\AdvancementNotReadyException;
use App\Exceptions\ClockNotEnabledException;
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
     * TODO: Take into account the `advancement_time` and `advancement_timezone`,
     *  representing user's local time when the calendar should advance
     *
     * @return void
     */
    public function handle()
    {
        $this->ensureCalendarShouldAdvance();

        logger()->debug("{$this->calendar->name} should advance.");

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
                $unitsSinceLastUpdate * $this->calendar->advancement_rate
            );

        $this->calendar->advancement_next_due = now()->$realWorldMethod($this->calendar->advancement_real_rate ?? 1)->startOfMinute();
        $this->calendar->save();


        $hasWebhook = $this->calendar->advancement_webhook_url || $this->calendar->discord_webhooks()->exists();

        logger()->debug("HasWebhook? " . $hasWebhook ? "yes" : "no");

        if($hasWebhook) {
            HitCalendarUpdateWebhook::dispatch($this->calendar);
        }
    }

    private function ensureCalendarShouldAdvance()
    {
        // Make sure advancement is enabled
        if(!$this->calendar->advancement_enabled) {
            throw new AdvancementNotEnabledException($this->calendar);
        }

        // Make sure we haven't accidentally doubled up on running the job
        if(!$this->calendar->advancement_next_due <= now()->startOfMinute()) {
            throw new AdvancementNotReadyException($this->calendar);
        }

        // Make sure all of the advancement settings are set
        collect([
            'advancement_rate',
            'advancement_rate_unit',
            'advancement_real_rate',
            'advancement_real_rate_unit',
        ])->each(function ($field) {
            if(empty($this->calendar->$field)) {
                throw new AdvancementNotReadyException($this->calendar);
            }
        });

        // Make sure the calendar doesn't expect to advance in units of hours or minutes without the clock enabled
        if(!$this->calendar->clock_enabled && in_array($this->calendar->advancement_rate_unit, ['minutes', 'hours'])) {
            throw new ClockNotEnabledException($this->calendar);
        }
    }
}
