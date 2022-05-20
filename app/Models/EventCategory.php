<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventCategory extends Model
{
    use SoftDeletes;

    public $fillable = [
        'name',
        'category_settings',
        'event_settings',
        'calendar_id',
        'sort_by',
    ];

    protected $hidden = ['deleted_at', 'calendar'];

    protected $casts = [
        'category_settings' => 'array',
        'event_settings' => 'array',
    ];

    public function calendar() {
        return $this->belongsTo(Calendar::class);
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
