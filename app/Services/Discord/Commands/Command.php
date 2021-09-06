<?php


namespace App\Services\Discord\Commands;


use App\Calendar;
use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Commands\Command\Traits\FormatsText;
use App\Services\Discord\Exceptions\DiscordUserUnauthorized;
use App\Facades\Epoch;
use App\Services\Discord\Exceptions\DiscordCalendarNotSetException;
use App\Services\Discord\Exceptions\DiscordUserInvalidException;
use App\Services\Discord\Models\DiscordAuthToken;
use App\Services\Discord\Models\DiscordGuild;
use App\Services\Discord\Models\DiscordInteraction;
use App\User;
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
    private bool $deferred;
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
     * @param bool $deferred
     * @throws DiscordUserInvalidException
     */
    public function __construct($interaction_data, bool $deferred = false)
    {
        $this->deferred = $deferred;
        $this->interaction_data = $interaction_data;
        $this->discord_nickname = $this->interaction('member.nick') ?? $this->interaction('member.user.username');
        $this->discord_username = $this->interaction('member.user.username') . "#" . $this->interaction('member.user.discriminator');
        $this->message_id = $this->interaction('message.id');
        $this->discord_user_id = $this->interaction('member.user.id');
        $this->options = self::getOptions($this->interaction('data.options.0'));
        $this->called_command = '/' . $this->getCalledCommand($this->interaction('data'));

        logger()->debug(json_encode($this->options));
        logger()->debug($this->called_command);
        logger()->debug(json_encode($this->interaction('data')));

        $this->logInteraction();
        $this->bindUser();

        if(!$this->authorize()) {
            $this->unauthorized();
        }

        $this->guild = $this->getGuild();
    }

    public function do_handle(): Response
    {
        $response = $this->handle();

        if($response instanceof Response) {
            return $response;
        }

        return (new Response($response));
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
        return ($value)
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
    private function bindUser(): void
    {
        if(!Arr::has($this->interaction_data, 'member.user.id')) {
            throw new DiscordUserInvalidException("Whoops! No user ID found in request. Discord messed up?");
        }

        $commandUserId = Arr::get($this->interaction_data, 'member.user.id');

        try {
            $this->discord_auth = DiscordAuthToken::discordUserId($commandUserId)->firstOrFail();
            $this->user = $this->discord_auth->user;
        } catch (\Throwable $e) {
            throw new DiscordUserInvalidException();
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

    /**
     * @throws DiscordCalendarNotSetException
     * @returns Calendar
     */
    protected function getDefaultCalendar(): Calendar
    {
        if(!$this->setting('default_calendar')) {
            if($this->user->calendars()->count() > 1){
                throw new DiscordCalendarNotSetException($this->user);
            }

            $this->setting('default_calendar', $this->user->calendars->first()->id);
        }

        $calendar = Calendar::findOrFail($this->setting('default_calendar'));

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
        logger()->debug('getCalledCommand on ' . json_encode($data));
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
     * Returns a string that will be sent back to the user if they are not authorized
     * to run this command.
     */
    public abstract function unauthorized(): void;
}
