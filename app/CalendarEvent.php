<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CalendarEvent extends Model
{
    use SoftDeletes;

    public $fillable = [
        'name',
        'calendar_id',
        'event_category_id',
        'description',
        'data',
        'settings',
        'sort_by',
    ];

    protected $hidden = ['deleted_at', 'category', 'calendar'];

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
