<?php

namespace App\Providers;

use App\Calendar;
use App\EventCategory;
use Illuminate\Support\Arr;
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
        'App\CalendarEvent' => 'App\Policies\EventPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('attach-event', function($user, $eventData) {
            $calendar = Calendar::findOrFail($eventData['calendar_id']);

            return $user->can('update', $calendar)

                || ($calendar->user->paymentLevel() == 'Worldbuilder'

                    && $calendar->users->contains($user) && in_array($calendar->users->find($user->id)->pivot->user_role, ['player', 'co-owner'])

                    && collect($eventData['data'] ?? [])->has('date')

                    && ($eventData['event_category_id'] ?? -1 >= 0)

                    && EventCategory::find($eventData['event_category_id'])

                    && EventCategory::find($eventData['event_category_id'])->setting('player_usable')
                );
        });

        Gate::define('add-event', function($user, $calendar) {
            return $user->can('update', $calendar)

                || ($calendar->user->paymentLevel() == 'Worldbuilder'

                    && $calendar->users->contains($user) && in_array($calendar->users->find($user->id)->pivot->user_role, ['player', 'co-owner'])
                );
        });

        Gate::define('add-users', function($user, $calendar) {
            return $user->is($calendar->user) && $calendar->user->paymentLevel() !== 'Free';
        });

        Gate::define('update-settings', function($user, $calendar) {
            return !empty($calendar) && $user->can('delete', $calendar);
        });

        Gate::define('link', function($user, $calendar) {
            return $user->can('delete', $calendar);
        });
    }
}
