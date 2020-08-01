<?php

namespace App\Policies;

use App\CalendarEvent;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EventPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\User  $user
     * @param  \App\CalendarEvent  $calendarEvent
     * @return mixed
     */
    public function view(User $user, CalendarEvent $calendarEvent)
    {
        return $user->can('view', $calendarEvent->calendar);
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\User  $user
     * @param  \App\CalendarEvent  $calendarEvent
     * @return mixed
     */
    public function update(User $user, CalendarEvent $calendarEvent)
    {
        return (
            $calendarEvent->calendar->user->is($user)
        );
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\User  $user
     * @param  \App\CalendarEvent  $calendarEvent
     * @return mixed
     */
    public function delete(User $user, CalendarEvent $calendarEvent)
    {
        return $user->can('delete', $calendarEvent->calendar);
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\User  $user
     * @param  \App\CalendarEvent  $calendarEvent
     * @return mixed
     */
    public function restore(User $user, CalendarEvent $calendarEvent)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\User  $user
     * @param  \App\CalendarEvent  $calendarEvent
     * @return mixed
     */
    public function forceDelete(User $user, CalendarEvent $calendarEvent)
    {
        return false;
    }
}
