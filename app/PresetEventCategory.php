<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PresetEventCategory extends Model
{
    public array $fillable = [
        'name',
        'category_settings',
        'event_settings',
        'preset_id',
        'label'
    ];


    protected array $casts = [
        'category_settings' => 'array',
        'event_settings' => 'array',
    ];
}
