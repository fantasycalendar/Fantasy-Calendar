<?php


namespace App\Services\Discord\Commands;


use App\Calendar;
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
    public function __construct($interaction_data, $deferred = false)
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

    protected function interaction($key)
    {
        return Arr::get($this->interaction_data, $key);
    }

    protected function setting($key, $value = null)
    {
        return ($value)
            ? $this->guild->setSetting($key, $value)
            : $this->guild->getSetting($key);
    }

    protected function getGuild()
    {
        return DiscordGuild::firstOrCreate(
            ['guild_id' => $this->interaction('guild_id'), 'discord_auth_id' => $this->discord_auth->id],
            ['user_id' => $this->user->id]
        );
    }

    private function bindUser()
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

    private function logInteraction()
    {
        DiscordInteraction::create([
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

    protected function codeBlock($string)
    {
        return "```\n$string\n```";
    }

    protected function bold($string)
    {
        return "**{$string}**";
    }

    protected function blockQuote($string)
    {
        return "> " . implode("\n> ",explode("\n", $string));
    }

    protected function heading($string, $min_length)
    {
        return Str::padBoth(" {$string} ", $min_length, '=');
    }

    protected function newLine($int = 1)
    {
        return str_repeat("\n", $int);
    }

    protected function mention()
    {
        return '<@' . $this->discord_user_id . '>';
    }

    protected function listCalendars()
    {
        return "```" . $this->user->calendars()->orderBy('name')->get()->map(function($calendar, $index) {
                return $index . ": " . $calendar->name;
            })->join("\n") . "```";
    }

    protected function getDefaultCalendar()
    {
        if(!$this->setting('default_calendar')) {
            throw new \Exception('That command requires you to set a default calendar using `/fc use`.');
        }

        return Calendar::find($this->setting('default_calendar'));
    }

    protected function option($key)
    {
        if(!Arr::has($this->options, $key)) {
            throw new \Exception("No option `{$key}` available to command `{$this->called_command}`");
        }

        return Arr::get($this->options, $key);
    }

    protected static function getOptions($data)
    {
        switch (Arr::get($data, 'type')) {
            case 1:
            case 2:
                return (!Arr::has($data, 'options'))
                    ? []
                    : collect(Arr::get($data, 'options'))->mapWithKeys(function($option){
                        return self::getOptions($option);
                    });
            case 3:
            case 4:
                return [$data['name'] => $data['value']];
            default:
                return [];
        }
    }

    protected static function getCalledCommand($data)
    {
        switch (Arr::get($data, 'type')) {
            case null:
            case 2:
                return Arr::get($data, 'name') . ' ' . self::getCalledCommand(Arr::get($data, 'options.0'));
            default:
                return Arr::get($data, 'name');
        }
    }

    public abstract function handle(): string;
}
