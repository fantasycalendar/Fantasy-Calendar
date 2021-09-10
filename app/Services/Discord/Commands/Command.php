<?php


namespace App\Services\Discord\Commands;


use App\Calendar;
use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Commands\Command\Traits\FormatsText;
use App\Services\Discord\Commands\Command\ChooseHandler;
use App\Services\Discord\Exceptions\DiscordUserHasNoCalendarsException;
use App\Services\Discord\Exceptions\DiscordUserUnauthorized;
use App\Facades\Epoch;
use App\Services\Discord\Exceptions\DiscordCalendarNotSetException;
use App\Services\Discord\Exceptions\DiscordUserInvalidException;
use App\Services\Discord\Models\DiscordAuthToken;
use App\Services\Discord\Models\DiscordGuild;
use App\Services\Discord\Models\DiscordInteraction;
use App\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

abstract class Command
{
    use FormatsText;

    protected User $user;
    protected $discord_auth;
    protected DiscordGuild $guild;
    protected array $interaction_data;
    protected string $response;
    private bool $deferred = false;
    protected string $discord_nickname;
    protected string $discord_username;
    protected string $discord_user_id;
    protected Collection $options;
    protected string $called_command;
    protected Response $response_details;
    private $message_id;

    /**
     * Command constructor.
     * @param $interaction_data
     * @throws DiscordUserInvalidException
     */
    public function __construct($interaction_data)
    {
        $this->interaction_data = $interaction_data;

        $this->initialize();
    }

    /**
     * Initializes some easy-access properties and resolves an FC user
     * from a Discord user, if possible. Just here to keep our constructor nice and clean.
     *
     * @throws DiscordUserInvalidException
     */
    private function initialize()
    {
        $this->discord_nickname = $this->interaction('member.nick') ?? $this->interaction('member.user.username');
        $this->discord_username = $this->interaction('member.user.username') . "#" . $this->interaction('member.user.discriminator');
        $this->message_id = $this->interaction('message.id');
        $this->discord_user_id = $this->interaction('member.user.id');
        $this->options = self::getOptions($this->interaction('data.options.0'));
        $this->called_command = '/' . $this->getCalledCommand($this->interaction('data'));

        $this->logInteraction();
        $this->resolveUserAccount();

        $this->guild = $this->getGuild();
    }

    /**
     * Calls the handle() method on whatever child command is extending us.
     * This makes it so that a simple handle() can just return a string,
     * which we'll readily convert to a Response object on the fly.
     *
     * @return Response
     */
    public function handleInteraction(): Response
    {
        $response = $this->handle();

        return ($response instanceof Response)
            ? $response
            : (new Response($response));
    }

    /**
     * @param $key
     * @return array|\ArrayAccess|mixed
     */
    protected function interaction($key)
    {
        return Arr::get($this->interaction_data, $key);
    }

    /**
     * @param $key
     * @param null $value
     * @return array|\ArrayAccess|mixed
     */
    protected function setting($key, $value = null)
    {
        return ($value !== null)
            ? $this->guild->setSetting($key, $value)
            : $this->guild->getSetting($key);
    }

    /**
     * Get the DiscordGuild for this user interaction
     *
     * @return DiscordGuild
     */
    protected function getGuild(): DiscordGuild
    {
        return DiscordGuild::firstOrCreate(
            ['guild_id' => $this->interaction('guild_id'), 'discord_auth_id' => $this->discord_auth->id],
            ['user_id' => $this->user->id]
        );
    }

    /**
     * Binds the Discord user ID for this interaction to a local FC user
     *
     * @throws DiscordUserInvalidException
     */
    private function resolveUserAccount(): void
    {
        if(!Arr::has($this->interaction_data, 'member.user.id')) {
            throw new DiscordUserInvalidException("Whoops! No user ID found in request. Discord messed up?");
        }

        $commandUserId = Arr::get($this->interaction_data, 'member.user.id');

        try {
            $this->discord_auth = DiscordAuthToken::discordUserId($commandUserId)->firstOrFail();
            $this->user = $this->discord_auth->user;
        } catch (\Throwable $e) {
            throw new DiscordUserInvalidException("You'll need to be a paid subscriber _(only $2.49/month!)_ on Fantasy Calendar and connect your Discord account to use this integration.");
        }

        if(!$this->authorize()) {
            $this->unauthorized();
        }
    }

    /**
     * Log the discord interaction in our local DB
     *
     * @return DiscordInteraction
     */
    private function logInteraction(): DiscordInteraction
    {
        return DiscordInteraction::create([
            'discord_id' => optional($this->discord_auth)->id,
            'channel_id' => $this->interaction('channel_id'),
            'type' => $this->interaction('type'),
            'guild_id' => $this->interaction('guild_id'),
            'data' => json_encode($this->interaction('data')),
            'discord_user' => json_encode($this->interaction('member')),
            'version' => $this->interaction('version'),
            'responded_at' => $this->deferred ? null : now()
        ]);
    }

    protected function resolveCalendar(): Calendar
    {
        try {
            return $this->user->calendars()
                ->whereId($this->setting('default_calendar'))
                ->firstOrFail();
        } catch (ModelNotFoundException $e) {
            if(!$this->user->calendars()->count()) {
                throw new DiscordUserHasNoCalendarsException();
            }

            if(!$this->setting('default_calendar')) {
                throw new DiscordCalendarNotSetException($this->user);
            }

            $message = Response::make("Your previously-set default calendar could not be found. Which one should we use, instead?")
                ->addRow(function(Response\Component\ActionRow $row){
                    return ChooseHandler::userDefaultCalendarMenu($this->user, $row);
                })
                ->addRow(function(Response\Component\ActionRow $row){
                    return $row->addButton(route('discord'), "Unexpected? We can help!");
                })
                ->ephemeral();

            throw new DiscordCalendarNotSetException($this->user, $message);
        }
    }

    /**
     * @throws DiscordCalendarNotSetException
     * @returns Calendar
     */
    protected function getDefaultCalendar()
    {
        $calendar = $this->resolveCalendar();

        Epoch::forCalendar($calendar);

        return $calendar;
    }

    /**
     * Retrieves an option with a specified name - Or, if given an array of names, returns the first match.
     * On finding none, returns null.
     *
     * @param $key
     * @return array|\ArrayAccess|mixed|null
     */
    protected function option($key)
    {
        if(is_array($key)) {
            foreach($key as $item) {
                if(Arr::has($this->options, $item)) {
                    return $this->option($item);
                }
            }

            return null;
        }

        return Arr::get($this->options, $key);
    }

    /**
     * @param $data
     * @return Collection
     */
    protected static function getOptions($data): Collection
    {
        switch (Arr::get($data, 'type')) {
            case 1:
            case 2:
                return (!Arr::has($data, 'options'))
                    ? collect()
                    : collect(Arr::get($data, 'options'))->mapWithKeys(function($option){
                        return self::getOptions($option);
                    });
            case 3:
            case 4:
                return collect([$data['name'] => $data['value']]);
            default:
                return collect();
        }
    }

    /**
     * Gets the called command as a string, sans options.
     * For example, if the user typed "/fc show month", this returns "fc show month"
     *
     * @param $data
     * @return array|\ArrayAccess|mixed|string
     */
    protected function getCalledCommand($data)
    {
        switch (Arr::get($data, 'type')) {
            case null:
                return '';
            case 4:
                return $this->options->join(' ');
            case 2:
            case 1:
                return Arr::get($data, 'name') . ' ' . self::getCalledCommand(Arr::get($data, 'options.0'));
            default:
                return Arr::get($data, 'name');
        }
    }

    protected static function target($function = null, array $args = null)
    {
        $configpath = Str::replace(' ', '.', static::signature());
        $function = (method_exists(static::class, $function))
            ? $function
            : 'handle';
        $args = $args
            ? ":" . implode(';', $args)
            : "";

        return "$configpath:$function$args";
    }

    protected static function fullSignature(string $override = null)
    {
        $signature = $override ?? static::signature();

        return '/' . config('services.discord.global_command') . ' ' . $signature;
    }

    /**
     * Handles the actual incoming Discord interaction, post-setup.
     * If you're extending this to build a Discord command, this is the method you want to write.
     *
     * @return string|Response
     */
    public abstract function handle();

    /**
     * Handles making sure the Discord user calling this command is allowed to do so.
     * See the "Traits" namespace for some examples.
     */
    public abstract function authorize(): bool;

    /**
     * Runs if the user is not authorized.
     */
    public abstract function unauthorized(): void;

    /**
     * Gets the expected Discord slash command name of this command
     * e.g. '/fc help' -> this should return 'help'
     */
    public abstract static function signature(): string;
}
