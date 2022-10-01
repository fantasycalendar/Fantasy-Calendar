<?php

namespace App\Services\Webhooks\Handlers;

use App\Http\Resources\V1\Calendar;
use App\Services\Webhooks\Handler;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class RawJson extends Handler
{
	public function send(array $eventDetails): void
	{
        logger()->debug($this->url);
		Http::post($this->url, [
            'calendar' => new Calendar($this->calendar),
            'event' => $eventDetails
        ]);
	}
}
