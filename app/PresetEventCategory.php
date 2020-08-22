<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PresetEventCategory extends Model
{
    protected $casts = [
        'category_settings' => 'array',
        'event_settings' => 'array',
    ];
}
