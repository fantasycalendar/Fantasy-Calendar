<?php

namespace App\Services\Discord\Models;

use App\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public function user() {
        return $this->belongsTo(User::class);
    }
}
