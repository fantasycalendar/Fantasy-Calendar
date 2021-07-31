<?php


namespace App\Services\Discord\Commands;


use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CommandDispatcher
{
    public static function dispatch($commandData)
    {
        $configPath = self::processConfigPath($commandData['data']);

        $handlerClass = config('services.discord.command_handlers' . $configPath);

        try {
            $response = (new $handlerClass($commandData))->handle();
        } catch (\Throwable $e) {
            Log::error($e->getTraceAsString());
            return $e->getMessage();
        }

        return $response;
    }

    public static function processConfigPath($optionsData, $soFar = '.')
    {
        $option = Arr::get($optionsData, '0', $optionsData);
        $name = Arr::get($option, 'name');

        if(Arr::has($option, 'options.0')) {
            $newPath = self::processConfigPath(Arr::get($option, 'options.0'), $soFar . $name . '.');

            if(config('services.discord.command_handlers' . $newPath)) {
                return self::processConfigPath(Arr::get($option, 'options.0'), $newPath . '.');
            }
        }

        if(config('services.discord.command_handlers' . $soFar . $name)) {
            return $soFar . $name;
        }

        return substr($soFar, 0, strlen($soFar) - 1);
    }
}
