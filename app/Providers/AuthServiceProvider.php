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

        Gate::define('attach-event', function($user, $event) {
            $calendar = Calendar::findOrFail($event->calendar_id);

//            echo json_encode([
//                'can_update' => $user->can('update', $calendar),
//                'owner_is_wb' => $calendar->user->paymentLevel() == 'Worldbuilder',
//                'user_in_calendar_list' => $calendar->users->contains($user),
//                'user_is_player_or_coowner' => in_array($calendar->users->find($user->id)->pivot->user_role, ['player', 'co-owner']),
//                'event_is_one_time' => collect($event->data ?? [])->has('date'),
//                'event_category_sane_id' => ($event->event_category_id ?? -1 >= 0),
//                'event_category_found' => EventCategory::find($event->event_category_id),
////                'event_category_player_usable' => EventCategory::find($event->event_category_id)->setting('player_usable')
//            ]);
//
//            die();

            return $user->can('update', $calendar)

                || ($calendar->user->paymentLevel() == 'Worldbuilder'

                    && $calendar->users->contains($user) && in_array($calendar->users->find($user->id)->pivot->user_role, ['player', 'co-owner'])

                    && collect($event->data ?? [])->has('date')

                    && ($event->event_category_id ?? -1 < 0
                        || (EventCategory::find($event->event_category_id) && EventCategory::find($event->event_category_id)->setting('player_usable'))
                    )
                );
        });

        Gate::define('add-events', function($user, $calendar) {
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
            return $user->is($calendar->user) && $calendar->user->paymentLevel() === 'WorldBuilder';
        });
    }
}
