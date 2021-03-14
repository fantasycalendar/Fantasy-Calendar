<?php


namespace App\Services\Discord\Commands;


use App\Services\Discord\Exceptions\DiscordUserInvalidException;
use App\Services\Discord\Models\DiscordAuthToken;
use Illuminate\Support\Arr;

abstract class Command
{
    protected $interaction_data;
    protected $user;
    protected $response;

    /**
     * Command constructor.
     * @param $interaction_data
     */
    public function __construct($interaction_data)
    {
        $this->interaction_data = $interaction_data;
        $this->discord_nickname = Arr::get($this->interaction_data, 'member.nick');
        $this->discord_username = Arr::get($this->interaction_data, 'member.user.username') . "#" . Arr::get($this->interaction_data, 'member.user.discriminator');
        $this->discord_user_id = Arr::get($this->interaction_data, 'member.user.id');

        $this->bindUser();
    }

    private function bindUser()
    {
        if(!Arr::has($this->interaction_data, 'member.user.id')) {
            dd($this->interaction_data);
            throw new DiscordUserInvalidException("No user ID found in request.");
        }

        $commandUserId = Arr::get($this->interaction_data, 'member.user.id');

        try {
            $this->user = DiscordAuthToken::whereDiscordUserId($commandUserId)->firstOrFail()->user;
        } catch (\Throwable $e) {
            throw new DiscordUserInvalidException("Sorry " . $this->discord_nickname . ", but you'll need to connect your Fantasy Calendar and Discord accounts to run commands.\n\nYou can do that here: (Hey Axel, insert a link here)");
        }
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
