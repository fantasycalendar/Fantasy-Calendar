<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PresetEventCategory extends Model
{
    public $fillable = [
        'name',
        'category_settings',
        'event_settings',
        'preset_id',
        'label'
    ];


    protected $casts = [
        'category_settings' => 'array',
        'event_settings' => 'array',
    ];
}
