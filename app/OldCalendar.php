<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OldCalendar extends Model
{
    //

    protected $table = 'calendars';

    public function user() {
        return $this->belongsTo('App\User');
    }
}
