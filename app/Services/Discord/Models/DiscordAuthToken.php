<?php

namespace App\Services\Discord\Models;

use App\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscordAuthToken extends Model
{
    use HasFactory;

    protected string $table = 'discord_auths';

    protected array $fillable = [
        'discord_user_id',
        'discord_username',
        'token',
        'refresh_token',
        'avatar',
        'discord_email',
        'expires_at'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function scopeDiscordUserId($query, $user_id) {
        return $query->where('discord_user_id', '=', $user_id);
    }
}
