<?php

namespace App\Policies;

use App\Calendar;
use App\CalendarEvent;
use App\CalendarEventComment;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EventCommentPolicy
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
     * @param CalendarEventComment  $calendarEventComment
     * @return mixed
     */
    public function view(User $user, CalendarEventComment $calendarEventComment)
    {
        return $user->can('view', $calendarEventComment->calendar);
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
     * @param  CalendarEventComment  $calendarEventComment
     * @return mixed
     */
    public function update(User $user, CalendarEventComment $calendarEventComment)
    {
        $calendar = Calendar::findOrFail($calendarEventComment->calendar_id);

        return (
            $calendar->user->is($user)

            || ($calendar->userHasPerms($user, 'co-owner'))

                || ($calendarEventComment->user->is($user)

                    && $calendar->userHasPerms($user, 'player'))

        );
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  User  $user
     * @param CalendarEventComment  $calendarEventComment
     * @return mixed
     */
    public function delete(User $user, CalendarEventComment $calendarEventComment)
    {
        return $user->can('update', $calendarEventComment);
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  User  $user
     * @param CalendarEventComment  $calendarEventComment
     * @return mixed
     */
    public function restore(User $user, CalendarEventComment $calendarEventComment)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  User  $user
     * @param CalendarEventComment  $calendarEventComment
     * @return mixed
     */
    public function forceDelete(User $user,CalendarEventComment $calendarEventComment)
    {
        return false;
    }
}
