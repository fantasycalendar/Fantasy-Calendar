<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Preset extends Model
{
    use SoftDeletes;

    public $fillable = [
        'name',
        'dynamic_data',
        'static_data',
        'description',
        'source_calendar_id',
        'creator_id'
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

    public function source()
    {
        return $this->belongsTo('App\Calendar', 'source_calendar_id');
    }

    public function creator()
    {
        return $this->belongsTo('App\User', 'creator_id');
    }

}
