<?php

namespace App\Jobs;

use App\Exceptions\AdvancementNotEnabledException;
use App\Exceptions\AdvancementNotReadyException;
use App\Exceptions\AdvancementTooEarlyException;
use App\Exceptions\ClockNotEnabledException;
use App\Models\Calendar;
use App\Services\Discord\API\Client;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;

class AdvanceCalendarWithRealTime implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public Calendar $calendar;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        public int $calendarId,
        public Carbon $now
    ) {
    }

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
        $this->calendar = Calendar::find($this->calendarId);

        if (!$this->calendarShouldAdvance()) {
            return;
        }

        logger()->debug("{$this->calendar->name} should advance.");

        $real_unit = ucfirst($this->calendar->advancement_real_rate_unit);

        $realWorldMethod = "add{$real_unit}";
        $realWorldDiffMethod = "diffIn{$real_unit}";
        $realWorldSubMethod = "sub{$real_unit}";

        if (!$this->calendar->advancement_next_due) {
            $this->calendar->advancement_next_due = $this->now->startOfMinute();
        }

        $unitsSinceLastUpdate = 1 + $this->calendar
            ->advancement_next_due
            ->$realWorldDiffMethod(
                $this->now->$realWorldSubMethod(
                    $this->calendar->advancement_real_rate ?? 1
                )
            ) / $this->calendar->advancement_real_rate ?? 1;

        $calendar_unit = ucfirst($this->calendar->advancement_rate_unit);
        $calendarMethod = "add{$calendar_unit}";

        $this->calendar
            ->$calendarMethod(
                $unitsSinceLastUpdate * $this->calendar->advancement_rate
            );

        $this->calendar->advancement_next_due = $this->now->$realWorldMethod($this->calendar->advancement_real_rate ?? 1)->startOfMinute();
        // $this->calendar->save();


        $hasWebhook = $this->calendar->advancement_webhook_url || $this->calendar->discord_webhooks()->exists();

        logger()->debug("HasWebhook? " . $hasWebhook ? "yes" : "no");

        if (app()->environment('production') && $hasWebhook) {
            HitCalendarUpdateWebhook::dispatch($this->calendar);
        }
    }

    private function calendarShouldAdvance()
    {
        // Make sure advancement is enabled
        if (!$this->calendar->advancement_enabled) {
            throw new AdvancementNotEnabledException($this->calendar);
        }

        // Make sure we haven't accidentally doubled up on running the job
        if ($this->calendar->advancement_next_due >= $this->now->startOfMinute()) {
            logger()->error("Tried to advance {$this->calendar->name} ({$this->calendar->hash}), but it's too early: " . now() . " - " . $this->calendar->advancement_next_due);

            return false;
        }

        // Make sure all of the advancement settings are set
        collect([
            'advancement_rate',
            'advancement_rate_unit',
            'advancement_real_rate',
            'advancement_real_rate_unit',
        ])->each(function ($field) {
            if (empty($this->calendar->$field)) {
                throw new AdvancementNotReadyException($this->calendar);
            }
        });

        // Make sure the calendar doesn't expect to advance in units of hours or minutes without the clock enabled
        if (!$this->calendar->clock_enabled && in_array($this->calendar->advancement_rate_unit, ['minutes', 'hours'])) {
            throw new ClockNotEnabledException($this->calendar);
        }

        return true;
    }
}
