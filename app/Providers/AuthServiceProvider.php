<?php

namespace App\Providers;

use App\EventCategory;
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

        Gate::define('attach-event', function($user, $calendar, $event = []) {
            dd([
                'userId' => $user->id,
                'Can Update' => $user->can('update', $calendar),
                'Worldbuilder' => $calendar->user->paymentLevel() == 'Worldbuilder',
                'Co-owner' => $calendar->users->contains($user) && $calendar->users->find($user->id)->pivot->user_role == 'co-owner',
                'Player' => $calendar->users->contains($user) && $calendar->users->find($user->id)->pivot->user_role == 'player',
                'Dates' => collect($event['data'] ?? [])->has('date'),
                'CatId' => ($event['event_category_id'] ?? -1 >= 0),
                'JSON' => EventCategory::find($event['event_category_id'] ?? -1) && EventCategory::find($event['event_category_id'] ?? -1)->setting('player_usable'),
            ]);

            return $user->can('update', $calendar)

                || ($calendar->user->paymentLevel() == 'Worldbuilder'

                    && $calendar->users->contains($user) && $calendar->users->find($user->id)->pivot->user_role == 'co-owner'
                )

                || ($calendar->user->paymentLevel() == 'Worldbuilder'

                    && $calendar->users->contains($user) && $calendar->users->find($user->id)->pivot->user_role == 'player'

                    && collect($event['data'] ?? [])->has('date')

                    && ($event['event_category_id'] ?? -1 >= 0)

                    && EventCategory::find($event['event_category_id'])

                    && EventCategory::find($event['event_category_id'])->setting('player_usable')
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
