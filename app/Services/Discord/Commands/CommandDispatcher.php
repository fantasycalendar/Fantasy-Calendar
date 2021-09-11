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

    /**
     * Accepts the entirety of a Discord interaction, routes it to our handlers accordingly, based on type
     * (https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object)
     *
     * @param $discordInteraction
     * @return array
     */
    public static function dispatch($discordInteraction): Response
    {
        return self::failGracefully(function() use ($discordInteraction) {
            $type = self::TYPES[$discordInteraction['type']];
            $method = 'dispatch' . $type;

            return forward_static_call([self::class, $method], $discordInteraction);
        });
    }

    /**
     * Dispatches user commands run directly via calling a slash command in Discord to the appropriate handler.
     * To clarify, that means *only* slash commands, not button clicks or similar.
     *
     * @param $commandData
     * @return Response
     */
    public static function dispatchCommand($commandData): Response
    {
        $handlerClass = config('services.discord.command_handlers' . self::processConfigPath($commandData['data']));

        return (new $handlerClass($commandData))
            ->handleInteraction();
    }

    /**
     * Dispatches component interactions, such as someone clicking a button or other "component" from us.
     * This assumes the component was created with a "custom_id" or "target" matching the Laravel config
     * path for the handler we want. For example, if you want 'services.discord.command_handlers.fc.help'
     * then your target should be 'fc.help' - And our component classes add the `fc` part of that for us.
     *
     * @param $interactionData
     * @return Response
     */
    public static function dispatchComponent($interactionData): Response
    {
        $interactionIdParts = explode(':', $interactionData['data']['custom_id']);

        $handlerClass = config('services.discord.command_handlers.'. $interactionIdParts[0]);
        $handlerFunction = $interactionIdParts[1];
        $args = $interactionData['data']['values'] ?? explode(';', $interactionIdParts[2] ?? null);

        $response = (new $handlerClass($interactionData, $interactionIdParts[0]))
            ->$handlerFunction(...$args);

        return ($response instanceof Response)
            ? $response
            : (new Response($response));
    }

    /**
     * Discord may occasionally reach out to us with a 'ping' just to make sure we're checking
     * for the appropriate signature on their requests to us. This just returns a 'pong' to
     * make them happy. We've outsourced the format of that pong to the Response class.
     *
     * @param $discordInteraction
     * @return Response
     */
    public static function dispatchPong($discordInteraction): Response
    {
        return Response::pong();
    }

    /**
     * Processes Discord's 'options within options, within more options' approach of providing arguments,
     * recursively resolving the options by name into handlers within our services config. This approach
     * means we can either have one big handler for 'fc.add' and its sub-commands OR individual handlers
     * for sub-commands, such as 'fc.add.day` and `fc.add.month`. This approach may change in the future.
     *
     * @param $optionsData
     * @param string $soFar
     * @return false|string
     */
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

    /**
     * This is just some syntactic sugar to try/catch and handle our custom DiscordExceptions.
     *
     * @param callable $function
     * @return Response
     */
    public static function failGracefully(callable $function): Response
    {
        try {
            return $function();
        } catch (DiscordException $e) {
            return $e->getResponse();
        } catch (\Throwable $e) {
            $errorToReturn = app()->environment('production')
                ? "Oops! There was an error. This was probably our fault, not yours. We've been notified about it, and will try to get it fixed when we can."
                : $e->getMessage();

            logger()->error($e);

            return Response::make($errorToReturn)->ephemeral();
        }
    }
}
