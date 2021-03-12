<?php

namespace App\Providers;

use App\Services\Discord\Http\Controllers\DiscordController;
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
            Route::prefix('hooks')->group(function(){
                Route::any('/', DiscordController::class.'@ping');
            });
        });
    }
}
