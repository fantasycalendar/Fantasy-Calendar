<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Calendar;
use Illuminate\Auth\Access\HandlesAuthorization;

class CalendarPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any calendars.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function viewAny(?User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can view the calendar.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Calendar  $calendar
     * @return mixed
     */
    public function view(?User $user, Calendar $calendar)
    {
        $user = $user ?? auth()->user() ?? null;

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
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function create(?User $user)
    {
        if($user) {
            return $user->isPremium() ||
                   $user->calendars()->count() < 2 ||
                   ($user->isEarlySupporter() && $user->calendars()->count() < 15);
        }

        return true;
    }

    public function embedAny(?User $user)
    {
        return feature('embed');
    }

    /**
     * Determine whether the user can update the calendar.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Calendar  $calendar
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
     * @param  \App\Models\User  $user
     * @param  \App\Models\Calendar  $calendar
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
     * @param  \App\Models\User  $user
     * @param  \App\Models\Calendar  $calendar
     * @return mixed
     */
    public function restore(User $user, Calendar $calendar)
    {
        //
    }

    public function enableLinking(User $user, Calendar $calendar)
    {
        return $user->can('update', $calendar)
            && $calendar->isLinkable();
    }


    public function enableAdvancement(User $user, Calendar $calendar)
    {
        return $user->can('update', $calendar)
            && !$calendar->isChild();
    }

    /**
     * Determine whether the user can permanently delete the calendar.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Calendar  $calendar
     * @return mixed
     */
    public function forceDelete(User $user, Calendar $calendar)
    {
        return $user->isAdmin();
    }
}
