<?php

namespace App\Providers;

use App\Services\Discord\Http\Controllers\DiscordController;
use App\Services\Discord\Http\Middleware\VerifyDiscordSignature;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class DiscordProvider extends ServiceProvider
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
                Route::any('/', DiscordController::class.'@ping');
            });

            Route::prefix('auth')->middleware(['web','auth'])->group(function(){
                Route::get('redirect', DiscordController::class.'@redirect');
                Route::get('callback', DiscordController::class.'@callback');
                Route::get('test', DiscordController::class.'@test');
            });
        });
    }
}
