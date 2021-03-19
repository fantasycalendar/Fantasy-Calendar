<?php

namespace App\Providers;

use App\Services\Discord\Http\Controllers\DiscordController;
use App\Services\Discord\Http\Middleware\VerifyDiscordSignature;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class DiscordServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        View::addNamespace('Discord', app_path('/Services/Discord/resources/views'));

        Route::prefix('discord')->group(function(){
            Route::prefix('hooks')->middleware([VerifyDiscordSignature::class])->group(function(){
                Route::any('/', DiscordController::class.'@hook');
            });

            Route::prefix('auth')->middleware(['web','auth'])->group(function(){
                Route::view('/', 'Discord::pages.connect-account')->name('discord.index');
                Route::get('user-redirect', DiscordController::class.'@user_redirect')->name('discord.auth.user');
                Route::get('server-owner-redirect',DiscordController::class.'@server_owner_redirect')->name('discord.auth.admin');
                Route::get('callback', DiscordController::class.'@callback')->name('discord.callback');
                Route::get('success', DiscordController::class.'@success')->name('discord.success');
                Route::get('remove', DiscordController::class.'@remove')->name('discord.auth.remove');
            });
        });
    }
}
