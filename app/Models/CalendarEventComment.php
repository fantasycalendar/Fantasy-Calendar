<?php

namespace App\Models;

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
        return $this->belongsTo(Calendar::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function event() {
        return $this->belongsTo(User::class);
    }
}
