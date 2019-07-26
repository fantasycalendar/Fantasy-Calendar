<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Calendar extends Model
{
    protected $table = 'calendars_beta';

    public $timestamps = false;

    public $fillable = [
        'user_id',
        'name',
        'dynamic_data',
        'static_data',
        'hash',
    ];

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function getDynamicDataAttribute($value) {
        return json_decode($value, true);
    }

    public function getStaticDataAttribute($value) {
        return json_decode($value, true);
    }

    public function scopeActive($query) {
        return $query->where('deleted', 0);
    }
}
