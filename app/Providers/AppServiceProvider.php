<?php

namespace App\Providers;

use App\CalendarEvent;
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
