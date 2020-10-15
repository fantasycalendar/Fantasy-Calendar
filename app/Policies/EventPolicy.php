<?php

namespace App\Policies;

use App\Calendar;
use App\CalendarEvent;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EventPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  User  $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  User  $user
     * @param  CalendarEvent  $calendarEvent
     * @return mixed
     */
    public function view(User $user, CalendarEvent $calendarEvent)
    {
        return $user->can('view', $calendarEvent->calendar);
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  User  $user
     * @param  CalendarEvent  $calendarEvent
     * @return mixed
     */
    public function update(User $user, CalendarEvent $calendarEvent)
    {
        $calendar = Calendar::findOrFail($calendarEvent->calendar_id);

        return (
            $calendar->user->is($user)

            || ($calendar->userHasPerms($user, 'co-owner'))

                || ($calendarEvent->creator->is($user)

                    && $calendar->userHasPerms($user, 'player'))

        );
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  User  $user
     * @param  CalendarEvent  $calendarEvent
     * @return mixed
     */
    public function delete(User $user, CalendarEvent $calendarEvent)
    {
        return $user->can('update', $calendarEvent);
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  User  $user
     * @param  CalendarEvent  $calendarEvent
     * @return mixed
     */
    public function restore(User $user, CalendarEvent $calendarEvent)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  User  $user
     * @param  CalendarEvent  $calendarEvent
     * @return mixed
     */
    public function forceDelete(User $user, CalendarEvent $calendarEvent)
    {
        return false;
    }
}
