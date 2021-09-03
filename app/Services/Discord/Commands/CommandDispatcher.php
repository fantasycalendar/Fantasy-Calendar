<?php


namespace App\Services\Discord\Commands;


use App\Services\Discord\Commands\Command\Response;
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
            if(request()->header('bypassChecks') && app()->environment('local')) {
                dd("result:", (new $handlerClass($commandData))->do_handle());
            }

            return (new $handlerClass($commandData))->do_handle();
        } catch (\Throwable $e) {
            Log::error($e->getTraceAsString());

            return (app()->environment('production'))
                ? (new Response("Oops! There was an error. This was probably our fault, not yours."))->getMessage()
                : (new Response($e->getMessage()))->getMessage();
        }
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
