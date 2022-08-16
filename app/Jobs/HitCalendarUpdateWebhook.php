<?php

namespace App\Jobs;

use App\Models\Calendar;
use App\Services\Discord\API\Client;
use App\Services\Discord\Commands\Command\Show\DateHandler;
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
        public Calendar $calendar
    ) {}

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if($this->calendar->advancement_webhook_url) {
            $method = $this->calendar->advancement_webhook_format ?? 'discord';

            $this->$method();
        }
    }

    public function discord()
    {
        // Ok this is a hack ... but hey! If it works, it works =]
        $dateString = sprintf("%s, %s", $this->calendar->epoch->weekdayName, $this->calendar->current_date);
        $text = "```\n";
        $text .= Str::padBoth(" {$this->calendar->name} ", strlen($dateString), '=');

        if($this->calendar->clock_enabled) {
            $text .= "\n" . Str::padBoth(" {$this->calendar->current_time} ", strlen($dateString));
        }

        $text .= "\n\n";
        $text .= $dateString . "\n";
        $text .= "```";

        $client = new Client();
        $client->hitWebhook($text, $this->calendar->advancement_webhook_url);
    }
}
