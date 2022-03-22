<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;

class CalendarEvent extends Model
{
    use SoftDeletes;

    public $fillable = [
        'name',
        'calendar_id',
        'creator_id',
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
        return $this->belongsTo(EventCategory::class, 'event_category_id');
    }

    public function calendar() {
        return $this->belongsTo(\App\Models\Calendar::class);
    }

    public function comments() {
        return $this->hasMany(CalendarEventComment::class, 'event_id');
    }

    public function creator() {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function getCreatorIdAttribute($value) {
        return $value ?? $this->calendar->user->id;
    }

    public function detail($key)
    {
        return Arr::get($this->data, $key);
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

    public function oneTime($year, $month, $day)
    {
        $this->data = [
            'has_duration' => false,
            'duration' => 1,
            'show_first_last' => false,
            'limited_repeat' => false,
            'limited_repeat_num' => 1,
            'conditions' => [
                [
                    "Date",
                    "0",
                    [
                        $year,
                        $month,
                        $day
                    ]
                ]
            ],
            'connected_events' => [],
            'date' => [
                $year,
                $month,
                $day
            ],
            'search_distance' => 0,
            'overrides' => [
                'moons' => []
            ]
        ];
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
