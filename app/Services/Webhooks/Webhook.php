<?php

namespace App\Services\Webhooks;

use App\Models\Calendar;
use App\Services\Discord\Webhooks\Discord;
use App\Services\Webhooks\Handlers\RawJson;
use Illuminate\Support\Arr;

class Webhook
{
    protected static array $webhookHandlers = [
        'raw_json' => RawJson::class,
        'discord' => Discord::class,
    ];


    public static function make(string $type, string $url, Calendar $calendar)
    {
        /**
         * @var Handler $handler
         */
        $handler = Arr::get(static::$webhookHandlers, $type, 'raw_json');

        return $handler::make($url, $calendar);
    }
}
