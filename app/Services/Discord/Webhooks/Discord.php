<?php

namespace App\Services\Discord\Webhooks;

use App\Services\Webhooks\Handler;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Str;

class Discord extends Handler
{
    public function send(array $event): void
    {
        $method = $event['event'];

        $this->$method($event['data'] ?? []);
    }

    private function calendarUpdated(?array $data = null)
    {
        $message = $data['message'] ?? null;

        if(!$message) {
            // Ok this is a hack ... but hey! If it works, it works =]
            $dateString = sprintf("%s, %s", $this->calendar->epoch->weekdayName, $this->calendar->current_date);
            $message = "```\n";
            $message .= Str::padBoth(" {$this->calendar->name} ", strlen($dateString), '=');

            if($this->calendar->clock_enabled) {
                $message .= "\n" . Str::padBoth(" {$this->calendar->current_time} ", strlen($dateString));
            }

            $message .= "\n\n";
            $message .= $dateString . "\n";
            $message .= "```";
        }

        $this->calendar
            ->discord_webhooks()
            ->active()
            ->where('persistent_message', true)
            ->each(function($webhook) use ($message) {
                $webhook->post($message);
            });
    }
}
