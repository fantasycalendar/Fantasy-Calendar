<?php

namespace App\Providers;

use App\Services\Discord\Http\Controllers\DiscordController;
use App\Services\Discord\Http\Middleware\VerifyDiscordSignature;
use Illuminate\Support\Facades\Route;
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
        Route::prefix('discord')->group(function(){
            Route::prefix('hooks')->middleware([VerifyDiscordSignature::class])->group(function(){
                Route::any('/', DiscordController::class.'@hook');
            });

            Route::prefix('auth')->middleware(['web','auth'])->group(function(){
                Route::get('user-redirect', DiscordController::class.'@user_redirect');
                Route::get('server-owner-redirect',DiscordController::class.'@server_owner_redirect');
                Route::get('callback', DiscordController::class.'@callback');
                Route::get('test', DiscordController::class.'@test');
            });
        });
    }
}
