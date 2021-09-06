<?php


namespace App\Services\Discord\Commands;


use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Exceptions\DiscordCalendarNotSetException;
use App\Services\Discord\Exceptions\DiscordException;
use App\Services\Discord\Exceptions\DiscordUserInvalidException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CommandDispatcher
{
    private const TYPES = [
        1 => 'Pong',
        2 => 'Command',
        3 => 'Component'
    ];

    public static function dispatch($discordInteraction): array
    {
        return self::failGracefully(function() use ($discordInteraction) {
            return forward_static_call([self::class, 'dispatch'. self::TYPES[$discordInteraction['type']]], $discordInteraction);
        })->getMessage();
    }

    public static function dispatchCommand($commandData): Response
    {
        $handlerClass = config('services.discord.command_handlers' . self::processConfigPath($commandData['data']));

        return (new $handlerClass($commandData))
            ->do_handle();
    }

    public static function dispatchComponent($interactionData): Response
    {
        $interactionIdParts = explode(':', $interactionData['data']['custom_id']);

        $handlerClass = config('services.discord.command_handlers.'. $interactionIdParts[0]);
        $handlerFunction = $interactionIdParts[1];
        $args = $interactionData['data']['values'] ?? explode(';', $interactionIdParts[2] ?? null);

        return (new $handlerClass($interactionData, $interactionIdParts[0]))
            ->$handlerFunction(...$args);
    }

    public static function dispatchPong($discordInteraction)
    {
        return Response::pong();
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

    public static function failGracefully(callable $function)
    {
        try {
            return $function();
        } catch (DiscordException $e) {
            return $e->getResponse();
        } catch (\Throwable $e) {
            Log::error($e->getMessage());
            Log::error($e->getTraceAsString());

            $errorToReturn = app()->environment('production')
                ? "Oops! There was an error. This was probably our fault, not yours."
                : $e->getMessage();

            return Response::make($errorToReturn)->ephemeral();
        }
    }
}
