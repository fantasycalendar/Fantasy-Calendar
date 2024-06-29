<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;

/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property string $selector
 * @property string $token
 * @property string $expires
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|Authtoken isExpired()
 * @method static \Illuminate\Database\Eloquent\Builder|Authtoken newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Authtoken newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Authtoken query()
 * @method static \Illuminate\Database\Eloquent\Builder|Authtoken whereExpires($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Authtoken whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Authtoken whereSelector($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Authtoken whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Authtoken whereUserId($value)
 * @mixin \Eloquent
 */
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
