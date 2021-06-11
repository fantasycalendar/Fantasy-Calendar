<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventCategory extends Model
{
    use SoftDeletes;

    public array $fillable = [
        'name',
        'category_settings',
        'event_settings',
        'calendar_id',
        'sort_by',
    ];

    protected array $hidden = ['deleted_at', 'calendar'];

    protected array $casts = [
        'category_settings' => 'array',
        'event_settings' => 'array',
    ];

    public function calendar() {
        return $this->belongsTo('App\Calendar');
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
