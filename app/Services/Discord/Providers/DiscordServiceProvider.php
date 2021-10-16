<?php

namespace App\Services\Discord\Providers;

use App\Events\ChildCalendarsUpdated;
use App\Services\Discord\Events\CalendarChildrenRequested;
use App\Services\Discord\Http\Controllers\DiscordController;
use App\Services\Discord\Http\Middleware\VerifyDiscordSignature;
use App\Services\Discord\Listeners\UpdateParentCalendarResponse;
use Illuminate\Support\Facades\Event;
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
        require_once(app_path('Services/Discord/helpers.php'));
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        if(!config('services.discord.enabled')) return;

        View::addNamespace('Discord', app_path('/Services/Discord/resources/views'));

        $this->registerRoutes();
        $this->registerEventListeners();
    }

    private function registerRoutes()
    {
        Route::prefix('discord')->group(function(){
            Route::view('account', 'Discord::pages.connect-account')->middleware(['web','auth'])->name('discord.index');

            Route::prefix('hooks')->middleware([VerifyDiscordSignature::class])->group(function(){
                Route::any('/', DiscordController::class.'@hook');
            });

            Route::prefix('auth')->middleware(['web','auth'])->group(function(){
                Route::get('user-redirect', DiscordController::class.'@user_redirect')->name('discord.auth.user');
                Route::get('server-owner-redirect',DiscordController::class.'@server_owner_redirect')->name('discord.auth.admin');
                Route::get('callback', DiscordController::class.'@callback')->name('discord.callback');
                Route::get('success', DiscordController::class.'@success')->name('discord.success');
                Route::get('remove', DiscordController::class.'@remove')->name('discord.auth.remove');
            });
        });
    }
    
    private function registerEventListeners()
    {
        Event::listen(ChildCalendarsUpdated::class, UpdateParentCalendarResponse::class);
        Event::listen(CalendarChildrenRequested::class, UpdateParentCalendarResponse::class);
    }
}
