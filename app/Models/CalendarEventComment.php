<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property int $event_id
 * @property int $calendar_id
 * @property string $content
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property-read \App\Models\Calendar|null $calendar
 * @property-read \App\Models\User|null $event
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEventComment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEventComment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEventComment query()
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEventComment whereCalendarId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEventComment whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEventComment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEventComment whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEventComment whereEventId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEventComment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEventComment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEventComment whereUserId($value)
 * @mixin \Eloquent
 */
class CalendarEventComment extends Model
{
    protected $fillable = [
        'user_id',
        'event_id',
        'calendar_id',
        'content'
    ];

    public function calendar() {
        return $this->belongsTo(Calendar::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function event() {
        return $this->belongsTo(User::class);
    }
}
