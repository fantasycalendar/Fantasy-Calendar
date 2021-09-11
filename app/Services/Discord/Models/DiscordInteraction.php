<?php

namespace App\Services\Discord\Models;

use App\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @method static create(array $array)
 */
class DiscordInteraction extends Model
{
    use HasFactory;

    protected $fillable = [
        'discord_id',
        'type',
        'data',
        'guild_id',
        'channel_id',
        'discord_user',
        'version',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function auth_token(): BelongsTo
    {
        return $this->belongsTo(DiscordAuthToken::class, 'discord_id');
    }
}
