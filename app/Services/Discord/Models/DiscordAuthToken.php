<?php

namespace App\Services\Discord\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static discordUserId(array|\ArrayAccess|mixed $commandUserId)
 */
class DiscordAuthToken extends Model
{
    use HasFactory;

    protected $table = 'discord_auths';

    protected $fillable = [
        'discord_user_id',
        'discord_username',
        'token',
        'refresh_token',
        'avatar',
        'discord_email',
        'expires_at'
    ];

    protected $casts = [
        'expires_at' => 'datetime'
    ];

    protected $dateFormat = 'Y-m-d H:i:s';

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function scopeDiscordUserId($query, $user_id) {
        return $query->where('discord_user_id', '=', $user_id);
    }
}
