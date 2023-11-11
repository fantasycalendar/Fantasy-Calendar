<?php

namespace App\Providers;

use App\Models\CalendarEvent;
use App\Console\Commands\DownCommand;
use App\Console\Commands\UpCommand;
use App\Observers\CalendarEventObserver;
use App\Services\EpochService\EpochFactory;
use Filament\Facades\Filament;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

use App\Observers\CalendarObserver;
use App\Models\Calendar;
use Spatie\LaravelIgnition\Facades\Flare;

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
        if(app()->environment(['local'])) {
            URL::forceRootUrl(config('app.url'));
        }

        $this->setupFlare();
        $this->setupQueueRateLimiters();
        $this->setupObservers();
        $this->setupCustomBladeDirectives();
        $this->setupPaginationFixes();
        $this->setupMaintenanceMode();
        $this->setupCollectionMacros();
    }

    private function setupFlare()
    {
        Flare::determineVersionUsing(function() {
            return '2.3.4';
        });
    }

    private function setupQueueRateLimiters()
    {
        RateLimiter::for('advancement', function($job){
            Limit::perMinute(1);
        });
    }

    private function setupCollectionMacros()
    {
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

        Collection::macro('whereStringContains', function(string $search) {
            return $this->filter(function($item) use ($search) {
                if(!is_string($item)) throw new \Exception("I can't search an unstringable object like it's a string!");

                return str_contains($item, $search);
            });
        });

        Collection::macro('withRunningTotal', function(string $field){
            $total = 0;
            $newFieldName = "${field}_running_total";

            return $this->map(function($item) use (&$total, $newFieldName, $field) {
                if(is_array($item)) {
                    $total += $item[$field];
                    $item[$newFieldName] = $total;

                    return $total;
                }

                $total += $item->$field;
                $item->$newFieldName = $total;

                return $item;
            });
        });

        Collection::macro('ensureSingleItem', function(){
            if($this->count() !== 1) {
                throw new \Exception('Could not resolve text line of current date to render with! The development team has been notified.');
            }

            return $this;
        });

        Collection::macro('firstKey', function() {
            return $this->keys()->first();
        });
    }

    private function setupObservers()
    {
        Calendar::observe(CalendarObserver::class);
        CalendarEvent::observe(CalendarEventObserver::class);
    }

    private function setupPaginationFixes()
    {
        \Illuminate\Pagination\AbstractPaginator::currentPathResolver(function () {
            /** @var \Illuminate\Routing\UrlGenerator $url */
            $url = app('url');
            return $url->current();
        });
    }

    private function setupCustomBladeDirectives()
    {
        Blade::if('setting', function($value) {
            return auth()->check() && auth()->user()->setting($value);
        });

        Blade::if('feature', function($value) {
            return feature($value);
        });
    }

    private function setupMaintenanceMode()
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
    }
}
