<?php


namespace App\Services\Discord\Commands;


use App\Calendar;
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
        $this->discord_user_id = $this->interaction('member.user.id');
        $this->called_command = '/' . self::getCalledCommand($this->interaction('data'));
        $this->options = self::getOptions($this->interaction('data.options.0'));

        logger()->debug(json_encode($this->options));
        logger()->debug(json_encode($this->interaction('data')));

        $this->logInteraction();
        $this->bindUser();

        $this->guild = $this->getGuild();
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
            throw new DiscordUserInvalidException("Sorry " . $this->discord_nickname . ", but you'll need to connect your Fantasy Calendar and Discord accounts to run commands.\n\nYou can do that here: " . route('discord.index'));
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
     * Formats the input string into a Markdown code block
     *
     * @param string $string
     * @return string
     */
    protected function codeBlock(string $string): string
    {
        return "```\n$string\n```";
    }

    /**
     * Formats the input string to be Markdown bold
     *
     * @param string $string
     * @return string
     */
    protected function bold(string $string): string
    {
        return "**{$string}**";
    }

    /**
     * Formats the input string to be a Markdown blockquote
     *
     * @param string $string
     * @return string
     */
    protected function blockQuote(string $string): string
    {
        return "> " . implode("\n> ",explode("\n", $string));
    }

    /**
     * Creates a nicely-formatted "heading" of a specified length. For example, given
     * "Harptos" and a length of 40, it will return the following string:
     * "=============== Harptos ================"
     *
     * @param string $string
     * @param int $min_length
     * @return string
     */
    protected function heading(string $string, int $min_length): string
    {
        return Str::padBoth(" {$string} ", $min_length, '=');
    }

    /**
     * Creates the specified number of newlines.
     *
     * @param int $amount
     * @return string
     */
    protected function newLine(int $amount = 1): string
    {
        return str_repeat("\n", $amount);
    }

    /**
     * Creates a formatted Discord mention for the specified Discord user, if given a Discord user ID.
     * If no user is specified, default to the user who called the command
     *
     * @param string|null $discord_user_id
     * @return string
     */
    protected function mention(string $discord_user_id = null): string
    {
        return '<@' . ($discord_user_id ?? $this->discord_user_id) . '>';
    }

    /**
     * Generates a
     *
     * @return string
     */
    protected function listCalendars(): string
    {
        return $this->codeBlock($this->user->calendars()->orderBy('name')->get()->map(function($calendar, $index) {
            return $index . ": " . $calendar->name;
        })->join("\n"));
    }

    /**
     * @throws DiscordCalendarNotSetException
     * @returns Calendar
     */
    protected function getDefaultCalendar(): Calendar
    {
        if(!$this->setting('default_calendar')) {
            throw new DiscordCalendarNotSetException('That command requires you to set a default calendar using `/fc use`.');
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
    protected static function getCalledCommand($data)
    {
        switch (Arr::get($data, 'type')) {
            case null:
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
     * @return string
     */
    public abstract function handle(): string;
}
