<?php

namespace App\Providers;

use App\Calendar;
use App\CalendarEvent;
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
        'App\CalendarEventComment' => 'App\Policies\EventCommentPolicy',
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

            return $user->can('update', $calendar)

                || ($calendar->userHasPerms($user, 'player')

                    && collect($event->data)->has('date') && $event->data['date'] != []

                    && ($event->event_category_id ?? -1 < 0
                        || (EventCategory::find($event->event_category_id) && EventCategory::find($event->event_category_id)->setting('player_usable'))
                    )
                );
        });

        Gate::define('add-comment', function($user, $data) {
            if(!Arr::has($data, ['event_id', 'calendar_id', 'content'])) {
                return false;
            }

            $calendar = Calendar::findOrFail(Arr::get($data, 'calendar_id'));
            $event = CalendarEvent::findOrFail(Arr::get($data, 'event_id'));

            if(!$calendar->events->contains($event)) {
                return false;
            }

            if($calendar->user->is($user)) {
                return true;
            }

            if($calendar->setting('comments') === 'players' && $user->can('add-events', $calendar)) {
                return true;
            }

            if($calendar->setting('comments') === 'public') {
                return true;
            }

            return false;
        });

        Gate::define('add-events', function($user, $calendar) {
            return $user->can('update', $calendar)
                && $calendar->userHasPerms($user, 'player');
        });

        Gate::define('advance-date', function($user, $calendar) {
            return $user->can('update', $calendar)
                || $calendar->userHasPerms($user, 'co-owner');
        });

        Gate::define('add-users', function($user, $calendar) {
            return $user->is($calendar->user) && $calendar->isPremium();
        });

        Gate::define('update-settings', function($user, $calendar) {
            return !empty($calendar) && $user->can('delete', $calendar);
        });

        Gate::define('link', function($user, $calendar) {
            return $user->is($calendar->user) && $calendar->isPremium();
        });
    }
}
