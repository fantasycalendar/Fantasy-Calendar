<?php

namespace App\Providers;

use App\CalendarEvent;
use App\Console\Commands\DownCommand;
use App\Console\Commands\UpCommand;
use App\Observers\CalendarEventObserver;
use App\Services\EpochService\EpochFactory;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Blade;
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
        $this->app->singleton('epoch', function($app){
            return new EpochFactory();
        });

        $this->app->bind('mustache', function($app){
            return new \Mustache_Engine(['entity_flags' => ENT_QUOTES]);
        });
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

        Blade::if('setting', function($value) {
            return auth()->check() && auth()->user()->setting($value);
        });

        if(app()->environment(['local'])) {
            URL::forceRootUrl(config('app.url'));
        }

        Paginator::useBootstrap();

        \Illuminate\Pagination\AbstractPaginator::currentPathResolver(function () {
            /** @var \Illuminate\Routing\UrlGenerator $url */
            $url = app('url');
            return $url->current();
        });

        Calendar::observe(CalendarObserver::class);
        CalendarEvent::observe(CalendarEventObserver::class);

        Collection::macro('whereAttributes', function($attributes) {
            return $this->filter(function($item) use ($attributes){
                foreach($attributes as $name => $value) {
                    if($item->$name != $value) return false;
                }

                return true;
            });
        });

        Collection::macro('toStrings', function(){
            return $this->map->toString();
        });

        Collection::macro('toString', function(string $glue = "\n") {
            return $this->toStrings()->join($glue);
        });

        Collection::macro('toArrays', function(){
            return $this->map->toArray();
        });

        Collection::macro('firstKey', function() {
            return $this->keys()->first();
        });
    }
}
