<?php

namespace App\Providers;

use App\Models\Calendar;
use App\Models\CalendarEvent;
use App\Models\EventCategory;
use App\Models\User;
use App\Policies\CalendarPolicy;
use App\Policies\EventCommentPolicy;
use App\Policies\EventPolicy;
use App\Policies\PersonalAccessTokenPolicy;
use App\Services\Discord\Models\DiscordWebhook;
use App\Services\Discord\Policies\DiscordWebhookPolicy;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Sanctum\PersonalAccessToken;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        \App\Models\Calendar::class => CalendarPolicy::class,
        \App\Models\CalendarEvent::class => EventPolicy::class,
        \App\Models\CalendarEventComment::class => EventCommentPolicy::class,
        PersonalAccessToken::class => PersonalAccessTokenPolicy::class,

        // Discord module
        DiscordWebhook::class => DiscordWebhookPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('administer-app', fn($user) => $user->isAdmin());

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

            return $calendar->setting('comments') && $calendar->userHasPerms($user, 'player');

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

        Gate::define('view-image', function(?User $user, $calendar) {
            return $calendar->isPremium();
        });
    }
}
