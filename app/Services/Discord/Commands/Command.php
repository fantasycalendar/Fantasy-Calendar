<?php


namespace App\Services\Discord\Commands;


use App\Calendar;
use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Commands\Command\Traits\FormatsText;
use App\Services\Discord\Commands\Command\ChooseHandler;
use App\Services\Discord\Exceptions\DiscordException;
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
    protected DiscordAuthToken $discord_auth;
    protected DiscordGuild $guild;
    protected DiscordInteraction $discord_interaction;
    protected array $interaction_data;
    protected string $response;
    /**
     * @var bool $deferred Set this to true if we're extending this to respond later
     */
    protected bool $deferred = false;
    protected string $discord_nickname;
    protected string $discord_username;
    protected string $discord_user_id;
    protected Collection $options;
    public string $called_command;
    protected Response $response_details;
    protected $message_id;

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

        $this->logInteraction();
        $this->resolveUserAccount();

        $this->options = $this->discord_interaction->options;
        $this->called_command = '/' . $this->discord_interaction->called_command;
        $this->guild = $this->getGuild();

        if(!$this->authorize()) {
            $this->unauthorized();
        }
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
     * Helper to get information from our Discord interaction
     *
     * @param $key
     * @return array|\ArrayAccess|mixed
     */
    protected function interaction($key)
    {
        return Arr::get($this->interaction_data, $key);
    }

    /**
     * Gets or sets a setting value
     *
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
     * Get or create the DiscordGuild for this user interaction
     *
     * @return DiscordGuild
     */
    protected function getGuild(): DiscordGuild
    {
        return DiscordGuild::firstOrCreate([
            'guild_id' => $this->interaction('guild_id'),
            'user_id' => $this->user->id
        ], ['discord_auth_id' => $this->discord_auth->id]);
    }

    /**
     * Binds the Discord user ID for this interaction to a local FC user and a local DiscordAuth record
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
            if($this->discord_interaction->wasRecentlyCreated) {
                logger()->debug('Interaction was recently created, associate with auth token');
                $this->discord_interaction->auth_token()->associate($this->discord_auth);
                $this->discord_interaction->save();
            }

            $this->user = $this->discord_auth->user;
            if($this->discord_interaction->wasRecentlyCreated) {
                logger()->debug('Interaction was recently created, associate with user');
                $this->discord_interaction->user()->associate($this->user);
                $this->discord_interaction->save();
            }

        } catch (ModelNotFoundException $e) {
            throw new DiscordUserInvalidException();
        }
    }

    /**
     * Log the discord interaction in our local DB
     *
     * @return void
     */
    private function logInteraction(): void
    {
        $fill = [
            'discord_id' => null,
            'channel_id' => $this->interaction('channel_id'),
            'type' => $this->interaction('type'),
            'guild_id' => $this->interaction('guild_id'),
            'data' => $this->interaction('data'),
            'discord_user' => $this->interaction('member'),
            'version' => $this->interaction('version'),
            'responded_at' => $this->deferred ? null : now(),
            'payload' => $this->interaction_data,
        ];

        if($this->interaction('message')) {
            $fill['parent_snowflake'] = $this->interaction('message.id');
        }

        $this->discord_interaction = DiscordInteraction::firstOrCreate([
                'snowflake' => $this->interaction('id'),
            ], $fill);
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
     * Gets the default calendar for this user in the discord server they're calling from
     *
     * @throws DiscordCalendarNotSetException
     * @returns Calendar
     */
    protected function getDefaultCalendar()
    {
        $calendar = $this->resolveCalendar();

        if(!$this->discord_interaction->calendar) {
            $this->discord_interaction->calendar()->associate($calendar);
            $this->discord_interaction->save();
        }

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
    public function option($key)
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
     * Generates our 'target' string format for a method on this command instance
     * For example, if our `services.discord.global_command` is set to `fc-dev` and we call:
     * DateChangesHandler::target('change_date', ['action' => 'sub', 'unit' => 'days', 'count' => 5])
     *
     * It will return the value
     * 'fc-dev.add:change_date:add;days;5'
     *
     * Which can then be used as a 'target' on a button component.
     *
     * @param null $function
     * @param array|null $args
     * @return string
     */
    protected static function target($function = null, array $args = null): string
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

    /**
     * Generates a 'signature' for the command, like `/fc add date`
     *
     * @param string|null $override
     * @return string
     */
    protected static function fullSignature(string $override = null): string
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
     * Runs if the user is not authorized. Should throw a DiscordException so we can provide rich interactions back to the user.
     * @throws DiscordException
     */
    public abstract function unauthorized(): void;

    /**
     * Gets the expected Discord slash command name of this command
     * e.g. '/fc help' -> this should return 'help'
     */
    public abstract static function signature(): string;
}
