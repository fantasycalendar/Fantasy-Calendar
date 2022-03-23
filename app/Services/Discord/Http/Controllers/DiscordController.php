<?php


namespace App\Services\Discord\Http\Controllers;


use App\Http\Controllers\Controller;
use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Commands\CommandDispatcher;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class DiscordController extends Controller
{
    /**
     * DiscordController constructor.
     *
     * All this really does is add our two middlewares:
     * - Ensure user is premium
     * - Make sure discord auth is setup when trying to go to the success page
     */
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
            if(Auth::check() && !Auth::user()->has('discord_auth')) {
                return redirect(route('discord.auth'));
            }

            return $next($request);
        })->only('success');
    }

    /**
     * When Discord reaches out to us with a user interaction, it'll hit here.
     *
     * @return array|int[]
     */
    public function hook(): array
    {
        return CommandDispatcher::dispatch(request()->all())
            ->getMessage();
    }

    public function test()
    {
        return config('services.discord.global_commands.fc');
    }

    /**
     * Sends a normal (non-server owner) user to the Discord Oauth2 authorization page
     * This is just for users who want to use a calendar in a server where FC is already setup.
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function user_redirect(): \Symfony\Component\HttpFoundation\RedirectResponse
    {
        return Socialite::driver('discord')->redirect();
    }


    /**
     * Sends a server-owner user to the Discord Oauth2 authorization page
     * A user who clicks "Add Fantasy Calendar to A Server"
     *
     * @return mixed
     */
    public function server_owner_redirect()
    {
        return Socialite::driver('discord')
            ->scopes(['applications.commands'])
            ->redirect();
    }

    /**
     * Users are sent here when they complete the Discord auth process.
     * All this does is create a DiscordAuth entry for the user
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function callback()
    {
        try {
            $user = Socialite::driver('discord')->user();
        } catch (ClientException $e) {
            Log::error('A user cancelled Discord auth.');
            return redirect(route('discord.index'))->with('error', 'Account connection cancelled.');
        } catch (\Throwable $e) {
            Log::error('A user cancelled Discord auth.');
            return redirect(route('discord.index'))->with('error', 'There was an error connecting your Discord account! Please try again, and if it happens again, let us know over on our Discord server.');
        }

        Auth::user()->discord_auth()->updateOrCreate([
            'discord_user_id' => $user->getId(),
        ], [
            'token' => $user->token,
            'refresh_token' => $user->refreshToken,
            'avatar' => $user->getAvatar(),
            'discord_email' => $user->getEmail(),
            'discord_username' => $user->getNickname(),
            'expires_at' => now()->addSeconds($user->expiresIn)
        ]);

        logger()->channel('discord')->info("'".Auth::user()->username."' has connected their Discord account to us!");

        return redirect(route('discord.index'))->with('message', 'Your Fantasy Calendar account was successfully connected to Discord!');
    }

    /**
     * This is the "Account connected" success page. Pretty straightforward, I think.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function success()
    {
        return view('Discord::pages.success', [
            'user' => Auth::user(),
            'discord_user' => Auth::user()->discord_auth
        ]);
    }

    /**
     * Lets a user disconnect their FC account from Discord, then redirects them to the calendars list with a message confirming as much.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function remove()
    {
        Auth::user()->discord_auth()->delete();

        return redirect(route('profile.integrations'))->with('alert', 'Your discord account has been disconnected from Fantasy Calendar.');
    }
}
