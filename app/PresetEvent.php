<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PresetEvent extends Model
{

    public array $fillable = [
        'name',
        'preset_id',
        'event_category_id',
        'preset_event_category_id',
        'description',
        'data',
        'settings',
    ];

    public array $hidden = [
        'id'
    ];

    protected array $casts = [
        'data' => 'array',
        'settings' => 'array',
    ];
}
