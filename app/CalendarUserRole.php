<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CalendarUserRole extends Pivot
{
    public function user() {
        return $this->belongsTo('App\User');
    }

    public function calendar() {
        return $this->belongsTo('App\User');
    }
}
