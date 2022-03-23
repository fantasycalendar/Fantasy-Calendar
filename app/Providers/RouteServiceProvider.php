<?php

namespace App\Providers;

use App\Models\Calendar;
use App\Facades\Epoch;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        Route::bind('calendar', function($hash) {
            $calendar = Calendar::hash($hash)->with([
                'events',
                'event_categories',
                'users' => function($query) {
                    $query->without('subscriptions');
                },
                'user',
                'parent',
                'children'
            ])->firstOrFail();

            Epoch::forCalendar($calendar);

            return $calendar;
        });

        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
        $this->mapApiRoutes();

        $this->mapWebRoutes();

        //
    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */
    protected function mapWebRoutes()
    {
        Route::middleware('web')
             ->group(base_path('routes/web.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiRoutes()
    {
        Route::prefix('api/v1')
             ->middleware(['api', 'api_version:v1'])
             ->group(base_path('routes/api_v1.php'));

        Route::prefix('api/v2')
            ->middleware(['api', 'api_version:v2', 'auth:sanctum'])
            ->group(base_path('routes/api_v2.php'));
    }

    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
