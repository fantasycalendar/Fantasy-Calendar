<?php

namespace App\Policies;

use App\User;
use App\Calendar;
use Illuminate\Auth\Access\HandlesAuthorization;

class CalendarPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any calendars.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function viewAny(?User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can view the calendar.
     *
     * @param  \App\User  $user
     * @param  \App\Calendar  $calendar
     * @return mixed
     */
    public function view(?User $user, Calendar $calendar)
    {
        return $calendar->setting('allow_view')
            || ($user
            && (
                $user->can('update', $calendar)
                || $user->can('attach-event', $calendar)
                || ($calendar->users->contains($user) && $calendar->users->find($user->id)->pivot->user_role == 'observer')
            ));
    }

    /**
     * Determine whether the user can create calendars.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the calendar.
     *
     * @param  \App\User  $user
     * @param  \App\Calendar  $calendar
     * @return mixed
     */
    public function update(User $user, Calendar $calendar)
    {
        if ($user->isAdmin()) {
            return true;
        }

        return
            $user->id === $calendar->user_id

            || (
                $calendar->user->paymentLevel() == 'Worldbuilder'

                && $calendar->users->contains($user) && $calendar->users->find($user->id)->pivot->user_role == 'co-owner'
            );
    }

    /**
     * Determine whether the user can delete the calendar.
     *
     * @param  \App\User  $user
     * @param  \App\Calendar  $calendar
     * @return mixed
     */
    public function delete(User $user, Calendar $calendar)
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->id === $calendar->user_id;
    }

    /**
     * Determine whether the user can restore the calendar.
     *
     * @param  \App\User  $user
     * @param  \App\Calendar  $calendar
     * @return mixed
     */
    public function restore(User $user, Calendar $calendar)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the calendar.
     *
     * @param  \App\User  $user
     * @param  \App\Calendar  $calendar
     * @return mixed
     */
    public function forceDelete(User $user, Calendar $calendar)
    {
        return $user->isAdmin();
    }
}
