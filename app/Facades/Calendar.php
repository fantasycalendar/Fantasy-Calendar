<?php

namespace App\Facades;

class Calendar extends \Illuminate\Support\Facades\Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'epoch';
    }
}
