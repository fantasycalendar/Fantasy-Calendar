<?php


namespace App\Services\Discord\Commands;


use App\Services\Discord\Exceptions\DiscordUserInvalidException;
use App\Services\Discord\Models\DiscordAuthToken;
use Illuminate\Support\Arr;

abstract class Command
{
    protected $interaction_data;
    private $user;

    /**
     * Command constructor.
     * @param $interaction_data
     */
    public function __construct($interaction_data)
    {
        $this->interaction_data = $interaction_data;

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
            $this->user = DiscordAuthToken::whereDiscordUserId($commandUserId)->firstOrFail();
        } catch (\Throwable $e) {
            throw new DiscordUserInvalidException("Could not bind command to user who invoked it.");
        }
    }

    public abstract function handle(): string;
}
