<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Preset extends Model
{

    public $with = [
        'events',
        'categories'
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
