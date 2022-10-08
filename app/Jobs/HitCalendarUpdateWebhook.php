<?php

namespace App\Jobs;

use App\Models\Calendar;
use App\Services\Discord\API\Client;
use App\Services\Discord\Commands\Command\Show\DateHandler;
use App\Services\Webhooks\Webhook;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

class HitCalendarUpdateWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        public Calendar $calendar,
        public ?string $message = null
    ) {}

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $method = $this->calendar->advancement_webhook_format;
        $webhook = Webhook::make($method, $this->calendar->advancement_webhook_url, $this->calendar);

        $webhook->send([
            'event' => 'calendarUpdated',
            'current_date' => $this->calendar->current_date,
            'year' => $this->calendar->year,
            'monthId' => $this->calendar->month_id,
            'day' => $this->calendar->day,
            'hour' => $this->calendar->clockEnabled ? $this->calendar->dynamic_data['hour'] : null,
            'minute' => $this->calendar->clockEnabled ? $this->calendar->dynamic_data['minute'] : null,
        ]);
    }
}
