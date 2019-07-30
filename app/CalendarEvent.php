<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CalendarEvent extends Model
{
    use SoftDeletes;

    public $fillable = [
        'name',
        'calendar_id',
        'description',
        'data',
        'category',
        'settings',
    ];

    protected $hidden = ['deleted_at'];

    protected $casts = [
        'data' => 'array',
        'settings' => 'array',
    ];

    public function category() {
        return $this->belongsTo('App\EventCategory');
    }

    public function calendar() {
        return $this->belongsTo('App\Calendar');
    }
}
