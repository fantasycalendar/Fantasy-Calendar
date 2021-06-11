<?php

namespace App;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;

class CalendarEvent extends Model
{
    use SoftDeletes;

    public array $fillable = [
        'name',
        'calendar_id',
        'creator_id',
        'event_category_id',
        'description',
        'data',
        'settings',
        'sort_by',
    ];

    protected array $hidden = ['deleted_at', 'category', 'calendar'];

    protected array $casts = [
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

    public function creator() {
        return $this->belongsTo('App\User', 'creator_id');
    }

    public function getCreatorIdAttribute($value) {
        return $value ?? $this->calendar->user->id;
    }

    public function setting($settingName, $default = false) {
        if(is_array($this->settings) && Arr::has($this->settings, $settingName)) {
            return Arr::get($this->settings, $settingName, $default);
        }

        return false;
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
