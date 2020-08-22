<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Preset extends Model
{
    public $fillable = [
        'name',
        'dynamic_data',
        'static_data',
        'description',
        'source_calendar_id'
    ];

    protected $casts = [
        'dynamic_data' => 'array',
        'static_data' => 'array',
    ];

    public function events()
    {
        return $this->hasMany(PresetEvent::class);
    }

    public function categories()
    {
        return $this->hasMany(PresetEventCategory::class);
    }
}
