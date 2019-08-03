<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventCategory extends Model
{
    use SoftDeletes;

    public $fillable = [
        'name',
        'category_settings',
        'event_settings',
        'calendar_id'
    ];

    protected $hidden = ['deleted_at', 'calendar'];

    protected $casts = [
        'category_settings' => 'array',
        'event_settings' => 'array',
    ];

    public function calendar() {
        return $this->belongsTo('App\Calendar');
    }
}
