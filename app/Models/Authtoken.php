<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;

class Authtoken extends Model
{
    protected $table = 'auth_tokens';

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function scopeIsExpired($query) {
        return $query->where('expires', '<', Carbon::now());
    }
}
