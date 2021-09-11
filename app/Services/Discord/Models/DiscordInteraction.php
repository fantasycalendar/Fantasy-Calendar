<?php

namespace App\Services\Discord\Models;

use App\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Arr;

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

    /**
     * Gets the called command as a string, sans options.
     * For example, if the user typed "/fc show month", this returns "fc show month"
     *
     * @param $data
     * @return array|\ArrayAccess|mixed|string
     */
    public function getCalledCommand($data = null)
    {
        $data = $data ?? $this->data;

        switch (Arr::get($data, 'type')) {
            case null:
                return '';
            case 4:
                return $this->options->join(' ');
            case 2:
            case 1:
                return Arr::get($data, 'name') . ' ' . static::getCalledCommand(Arr::get($data, 'options.0'));
            default:
                return Arr::get($data, 'name');
        }
    }
}
