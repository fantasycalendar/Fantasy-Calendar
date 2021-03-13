<?php


namespace App\Services\Discord\Http\Controllers;


use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\Facades\Socialite;

class DiscordController extends \App\Http\Controllers\Controller
{
    public function ping()
    {
        return ['type' => 1];
    }

    public function redirect()
    {
        return Socialite::driver('discord')->redirect();
    }

    public function callback()
    {
        $user = Socialite::driver('discord')->user();

        $info = json_encode([
            $user->getId(),
            $user->getNickname(),
            $user->getName(),
            $user->getEmail(),
            $user->getAvatar()
        ]);

        Storage::put('discord_user.json', $info);

        return $info;
    }
}
