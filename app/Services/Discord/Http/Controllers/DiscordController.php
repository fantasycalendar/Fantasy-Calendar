<?php


namespace App\Services\Discord\Http\Controllers;


use App\Services\Discord\Commands\CommandDispatcher;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\Facades\Socialite;

class DiscordController extends \App\Http\Controllers\Controller
{
    public function __construct()
    {
        // Ensure user is premium
        $this->middleware(function($request, $next){
            if(Auth::check() && !Auth::user()->isPremium()) {
                return redirect(route('subscription.pricing'))->with('alert', 'Thanks for using Fantasy Calendar! Please subscribe to enable the Discord integration.');
            }

            return $next($request);
        })->except('hook');

        // Ensure user has discord auth setup before letting them go to success page
        $this->middleware(function($request, $next){
            if(Auth::check() && !Auth::user()->discord_auth()->exists()) {
                return redirect(route('discord.auth'));
            }

            return $next($request);
        })->only('success');
    }

    public function hook()
    {
        // Respond to Discord's pings with a 'type' to make them happy
        if(!request()->has('data')) {
            return ['type' => 1];
        }

        // Type 4 means we're responding directly.
        // For now, we don't queue and follow-up, but a type 5 would make that possible.
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

    public function user_redirect()
    {
        return Socialite::driver('discord')->redirect();
    }

    public function server_owner_redirect()
    {
        return Socialite::driver('discord')
            ->scopes(['applications.commands'])
            ->redirect();
    }

    public function callback()
    {
        try {
            $user = Socialite::driver('discord')->user();
        } catch (ClientException $e) {
            Log::error('A user cancelled Discord auth.');
            return redirect(route('discord.index'));
        }

        if(Auth::user()->discord_auth()->exists()) {
            Auth::user()->discord_auth->delete();
        }

        Auth::user()->discord_auth()->create([
            'token' => $user->token,
            'refresh_token' => $user->refreshToken,
            'avatar' => $user->getAvatar(),
            'discord_email' => $user->getEmail(),
            'discord_user_id' => $user->getId(),
            'discord_username' => $user->getNickname(),
            'expires_at' => now()->addSeconds($user->expiresIn)
        ]);

        return redirect(route('discord.success'));
    }

    public function success()
    {
        return view('Discord::pages.success', [
            'user' => Auth::user(),
            'discord_user' => Auth::user()->discord_auth
        ]);
    }
}
