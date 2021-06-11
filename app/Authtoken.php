<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;

class Authtoken extends Model
{
    protected string $table = 'auth_tokens';

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function scopeIsExpired($query) {
        return $query->where('expires', '<', Carbon::now());
    }
}
