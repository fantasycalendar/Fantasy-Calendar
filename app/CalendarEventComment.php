<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CalendarEventComment extends Model
{
    protected $fillable = [
        'user_id',
        'event_id',
        'calendar_id',
        'content'
    ];

    public function calendar() {
        return $this->belongsTo('App\Calendar');
    }

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function event() {
        return $this->belongsTo('App\User');
    }
}
