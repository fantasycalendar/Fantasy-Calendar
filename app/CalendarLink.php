<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CalendarLink extends Model
{

    public $fillable = [
        'offset',
        'parent_start_date',
    ];

    public function master() {
        return $this->belongsTo('App\Calendar');
    }

    public function child() {
        return $this->hasMany('App\Calendar');
    }

}
