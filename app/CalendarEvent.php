<?php

namespace App;

use DateTimeInterface;
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
        return $this->belongsTo('App\EventCategory', 'event_category_id');
    }

    public function calendar() {
        return $this->belongsTo('App\Calendar');
    }

    public function comments() {
        return $this->hasMany('App\CalendarEventComment', 'event_id');
    }

    public function getDescriptionAttribute($value) {
        return html_entity_decode($value);
    }

    /**
     * Prepare a date for array / JSON serialization
     *
     * @param \DateTimeInterface $date
     * @return string
     */
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
