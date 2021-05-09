<?php


namespace App\Services\Discord\Commands;


use App\Calendar;
use App\Services\Discord\Exceptions\DiscordUserInvalidException;
use App\Services\Discord\Models\DiscordAuthToken;
use App\Services\Discord\Models\DiscordGuild;
use App\Services\Discord\Models\DiscordInteraction;
use App\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

abstract class Command
{
    protected array $interaction_data;
    protected User $user;
    protected string $response;
    private bool $deferred;
    protected $discord_nickname;
    protected $discord_username;
    protected $discord_user_id;
    protected $discord_auth;
    protected $guild;

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

    protected function blockQuote($string)
    {
        return "> $string\n";
    }

    protected function newLine()
    {
        return "\n";
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

    public abstract function handle(): string;
}
