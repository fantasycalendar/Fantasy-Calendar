<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Preset extends Model
{
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
