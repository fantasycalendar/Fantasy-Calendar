<?php


namespace App\Services\Discord\Commands;


use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class CommandDispatcher
{
    public static function dispatch($commandData)
    {
        $configPath = self::processConfigPath($commandData['data']);

        $handlerClass = config('services.discord.command_handlers.' . $configPath);

        try {
            $response = (new $handlerClass($commandData))->handle();
        } catch (\Throwable $e) {
            Log::error($e->getTraceAsString());
            return $e->getMessage();
        }

        return $response;
    }

    public static function processConfigPath($optionsData)
    {
        $option = Arr::get($optionsData, '0', $optionsData);

        if(Arr::get($option, 'type') < 3) {
            if(Arr::has($option, 'options.0.type') && Arr::get($option, 'options.0.type') < 3) {
                return Arr::get($option, 'name') . '.' . self::processConfigPath($option['options']);
            }
        }

        return Arr::get($option, 'name');
    }
}
