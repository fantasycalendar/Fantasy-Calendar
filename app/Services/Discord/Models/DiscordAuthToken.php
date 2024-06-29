<?php

namespace App\Services\Discord\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @method static discordUserId(array|\ArrayAccess|mixed $commandUserId)
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $user_id
 * @property string $discord_user_id
 * @property string $discord_username
 * @property string $token
 * @property string $refresh_token
 * @property string|null $avatar
 * @property string $discord_email
 * @property \Illuminate\Support\Carbon|null $expires_at
 * @property-read User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordAuthToken newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordAuthToken newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordAuthToken query()
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordAuthToken whereAvatar($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordAuthToken whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordAuthToken whereDiscordEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordAuthToken whereDiscordUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordAuthToken whereDiscordUsername($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordAuthToken whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordAuthToken whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordAuthToken whereRefreshToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordAuthToken whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordAuthToken whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordAuthToken whereUserId($value)
 * @mixin \Eloquent
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
