<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PresetEvent extends Model
{

    public $fillable = [
        'name',
        'preset_id',
        'event_category_id',
        'preset_event_category_id',
        'description',
        'data',
        'settings',
    ];

    public $hidden = [
        'id'
    ];

    protected $casts = [
        'data' => 'array',
        'settings' => 'array',
    ];
}
