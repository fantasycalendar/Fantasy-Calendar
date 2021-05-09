<?php


namespace App\Facades;


/**
 * @method static render(mixed $formatting, array $array)
 */
class Mustache extends \Illuminate\Support\Facades\Facade
{
    protected static function getFacadeAccessor()
    {
        return 'mustache';
    }
}
