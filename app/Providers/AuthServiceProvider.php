<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
         'App\Calendar' => 'App\Policies\CalendarPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('attach-event', function($user, $calendar) {
            return $user->can('update', $calendar)

                || ($calendar->user->paymentLevel() == 'Worldbuilder'

                    && $calendar->users->contains($user) && $calendar->users->find($user->id)->pivot->user_role == 'co-owner'
                );
        });

        Gate::define('update-settings', function($user, $calendar) {
            return $user->can('delete', $calendar);
        });

        Gate::define('link', function($user, $calendar) {
            return $user->can('delete', $calendar);
        });
    }
}
