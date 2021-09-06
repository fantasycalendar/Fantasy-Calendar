<?php


namespace App\Services\Discord\Commands;


use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Exceptions\DiscordCalendarNotSetException;
use App\Services\Discord\Exceptions\DiscordUserInvalidException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CommandDispatcher
{
    public static function handleCommand($commandData)
    {
        logger()->debug(json_encode($commandData));
        return self::failGracefully(function() use ($commandData){
            $configPath = self::processConfigPath($commandData['data']);

            $handlerClass = config('services.discord.command_handlers' . $configPath);

            return (new $handlerClass($commandData))->do_handle();
        });

    }

    public static function handleComponent($interactionData)
    {
        logger()->debug(json_encode($interactionData));
        return self::failGracefully(function() use ($interactionData){
            $interactionIdParts = explode(':', $interactionData['data']['custom_id']);

            $handlerClass = config('services.discord.command_handlers.'. $interactionIdParts[0]);
            $handlerFunction = $interactionIdParts[1];
            $args = $interactionData['data']['values'] ?? explode(';', $interactionIdParts[2] ?? null);

            return (new $handlerClass($interactionData, $interactionIdParts[0]))
                ->$handlerFunction(...$args)
                ->getMessage();
        });
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

    private static function failGracefully(callable $function): array
    {
        try {
            return $function();
        } catch (DiscordUserInvalidException | DiscordCalendarNotSetException $e) {
            return $e->getResponse();
        } catch (\Throwable $e) {
            Log::error($e->getMessage());
            Log::error($e->getTraceAsString());

            $errorToReturn = app()->environment('production')
                ? "Oops! There was an error. This was probably our fault, not yours."
                : $e->getMessage();

            return Response::make($errorToReturn)
                ->ephemeral()
                ->getMessage();
        }
    }
}
