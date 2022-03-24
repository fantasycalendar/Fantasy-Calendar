<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CalendarUserRole extends Pivot
{
    public function user() {
        return $this->belongsTo(User::class);
    }

    public function calendar() {
        return $this->belongsTo(User::class);
    }
}
