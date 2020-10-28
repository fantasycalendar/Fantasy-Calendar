<?php

namespace App\Providers;

use App\CalendarEvent;
use App\Console\Commands\DownCommand;
use App\Console\Commands\UpCommand;
use App\Observers\CalendarEventObserver;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\URL;
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
        /**
         * Override Laravel's "php artisan down" command to put the application in maintenance mode
         * using our custom Redis based lock.
         */
        $this->app->extend('command.down', function () {
            return new DownCommand();
        });

        /**
         * Override Laravel's "php artisan up" command to bring the application out of maintenance mode
         * using our custom Redis based lock.
         */
        $this->app->extend('command.up', function () {
            return new UpCommand();
        });


        // URL::forceRootUrl(config('app.url'));
        Paginator::useBootstrap();

        \Illuminate\Pagination\AbstractPaginator::currentPathResolver(function () {
            /** @var \Illuminate\Routing\UrlGenerator $url */
            $url = app('url');
            return $url->current();
        });

        Calendar::observe(CalendarObserver::class);
        CalendarEvent::observe(CalendarEventObserver::class);
    }
}
