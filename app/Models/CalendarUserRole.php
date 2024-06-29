<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property int $calendar_id
 * @property string $user_role
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $calendar
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarUserRole newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarUserRole newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarUserRole query()
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarUserRole whereCalendarId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarUserRole whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarUserRole whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarUserRole whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarUserRole whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarUserRole whereUserRole($value)
 * @mixin \Eloquent
 */
class CalendarUserRole extends Pivot
{
    public function user() {
        return $this->belongsTo(User::class);
    }

    public function calendar() {
        return $this->belongsTo(User::class);
    }
}
