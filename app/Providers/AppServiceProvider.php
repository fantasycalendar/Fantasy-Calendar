<?php

namespace App\Providers;

use App\CalendarEvent;
use App\Observers\CalendarEventObserver;
use Illuminate\Support\ServiceProvider;

use App\Observers\CalendarObserver;
use App\Calendar;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Calendar::observe(CalendarObserver::class);
        CalendarEvent::observe(CalendarEventObserver::class);
    }
}
