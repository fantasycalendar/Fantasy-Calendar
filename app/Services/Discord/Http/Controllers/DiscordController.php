<?php


namespace App\Services\Discord\Http\Controllers;


use App\Services\Discord\Commands\CommandDispatcher;
use App\Services\Discord\Http\Middleware\VerifyDiscordSignature;
use App\Services\Discord\Models\DiscordAuthToken;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\Facades\Socialite;
use RestCord\DiscordClient;

class DiscordController extends \App\Http\Controllers\Controller
{
    public function __construct()
    {
        $this->middleware(function($request, $next){
            if(Auth::check() && !Auth::user()->isPremium()) {
                return redirect(route('subscription.pricing'))->with('alert', 'Thanks for using Fantasy Calendar! Please subscribe to enable the Discord integration.');
            }

            return $next($request);
        })->except('hook');
    }

    public function hook()
    {
        if(!request()->has('data')) {
            return ['type' => 1];
        }

        return [
            'type' => 4,
            'data' => [
                'content' => CommandDispatcher::dispatch(request()->all()),
            ]
        ];
    }

    public function test()
    {
        return config('services.discord.global_commands.fc');
    }

    public function redirect()
    {
        return Socialite::driver('discord')
            ->scopes(['guilds','applications.commands'])
            ->redirect();
    }

    public function callback()
    {
        $user = Socialite::driver('discord')->user();

        if(Auth::user()->discord_auth()->exists()) {
            Auth::user()->discord_auth->delete();
        }

        $discordAuth = Auth::user()->discord_auth()->create([
            'token' => $user->token,
            'refresh_token' => $user->refreshToken,
            'avatar' => $user->getAvatar(),
            'discord_email' => $user->getEmail(),
            'discord_user_id' => $user->getId(),
            'discord_username' => $user->getNickname(),
            'expires_at' => now()->addSeconds($user->expiresIn)
        ]);

        $info = json_encode([
            $user->token,
            $refreshToken = $user->refreshToken,
            $expiresIn = $user->expiresIn,
            $user->getId(),
            $user->getNickname(),
            $user->getName(),
            $user->getEmail(),
            $user->getAvatar()
        ]);

        Storage::put('discord_user.json', $info);

        return redirect('/discord/auth/test');
    }
}
