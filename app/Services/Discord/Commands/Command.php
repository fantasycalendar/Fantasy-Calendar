<?php


namespace App\Services\Discord\Commands;


use App\Services\Discord\Exceptions\DiscordUserInvalidException;
use App\Services\Discord\Models\DiscordAuthToken;
use App\Services\Discord\Models\DiscordInteraction;
use App\User;
use Illuminate\Support\Arr;

abstract class Command
{
    protected array $interaction_data;
    protected User $user;
    protected string $response;
    private bool $deferred;
    protected string $discord_nickname;
    protected string $discord_username;
    protected string $discord_user_id;
    protected $discord_auth;

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
        $this->discord_nickname = Arr::get($this->interaction_data, 'member.nick');
        $this->discord_username = Arr::get($this->interaction_data, 'member.user.username') . "#" . Arr::get($this->interaction_data, 'member.user.discriminator');
        $this->discord_user_id = Arr::get($this->interaction_data, 'member.user.id');

        $this->bindUser();
        $this->logInteraction();
    }

    private function bindUser()
    {
        if(!Arr::has($this->interaction_data, 'member.user.id')) {
            throw new DiscordUserInvalidException("Whoops! No user ID found in request. Discord messed up?");
        }

        $commandUserId = Arr::get($this->interaction_data, 'member.user.id');

        try {
            $this->discord_auth = DiscordAuthToken::whereDiscordUserId($commandUserId)->firstOrFail();
            $this->user = $this->discord_auth->user;
        } catch (\Throwable $e) {
            throw new DiscordUserInvalidException("Sorry " . $this->discord_nickname . ", but you'll need to connect your Fantasy Calendar and Discord accounts to run commands.\n\nYou can do that here: (Hey Axel, insert a link here)");
        }
    }

    private function logInteraction()
    {
        DiscordInteraction::create([
            'discord_id' => $this->discord_auth->id,
            'channel_id' => Arr::get($this->interaction_data, 'channel_id'),
            'type' => Arr::get($this->interaction_data, 'type'),
            'guild_id' => Arr::get($this->interaction_data, 'guild_id'),
            'data' => json_encode(Arr::get($this->interaction_data, 'data')),
            'discord_user' => json_encode(Arr::get($this->interaction_data, 'member')),
            'version' => Arr::get($this->interaction_data, 'version'),
            'responded_at' => $this->deferred ? null : now()
        ]);
    }

    protected function codeBlock($string)
    {
        $this->response .= "```\n$string\n```";
    }

    protected function blockQuote($string)
    {
        $this->response .= "> $string\n";
    }

    protected function newLine()
    {
        $this->response .= "\n";
    }

    protected function mention()
    {
        return '<@' . $this->discord_user_id . '>';
    }

    public abstract function handle(): string;
}
