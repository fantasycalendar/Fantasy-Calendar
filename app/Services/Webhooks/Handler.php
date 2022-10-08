<?php

namespace App\Services\Webhooks;

use App\Models\Calendar;
use Illuminate\Http\Client\Response;

abstract class Handler
{
    public string $format;

    public function __construct(
        protected string $url,
        protected Calendar $calendar
    ) {}

    public abstract function send(array $event): void;

    public static function make(string $url, Calendar $calendar): static
    {
        return new static($url, $calendar);
    }
}
