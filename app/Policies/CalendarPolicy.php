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
        $user = $user ?? auth('api')->user() ?? null;

        return !$calendar->disabled
            && (!$calendar->setting('private')
            || (
                $user

                && (
                    $user->isAdmin()

                    || $user->is($calendar->user)

                    || $calendar->users->contains($user)
                )
            ));
    }

    /**
     * Determine whether the user can create calendars.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(?User $user)
    {
        if($user) {
            return  $user->calendars()->count() < 2 || $user->paymentLevel() != 'Free';
        }

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

        return !$calendar->disabled && $user->id === $calendar->user_id;
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

        return !$calendar->disabled && $user->id === $calendar->user_id;
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
