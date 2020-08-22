<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PresetEvent extends Model
{
    public $hidden = [
        'id'
    ];

    protected $casts = [
        'data' => 'array',
        'settings' => 'array',
    ];
}
