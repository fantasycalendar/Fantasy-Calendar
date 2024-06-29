<?php


namespace App\Services\Discord\Models;


use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

/**
 * 
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $user_id
 * @property int $discord_auth_id
 * @property string $guild_id
 * @property array|null $guild_settings
 * @property string|null $responded_at
 * @property-read \App\Services\Discord\Models\DiscordAuthToken|null $discord_user
 * @property-read User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordGuild newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordGuild newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordGuild query()
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordGuild whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordGuild whereDiscordAuthId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordGuild whereGuildId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordGuild whereGuildSettings($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordGuild whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordGuild whereRespondedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordGuild whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordGuild whereUserId($value)
 * @mixin \Eloquent
 */
class DiscordGuild extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'discord_auth_id',
        'guild_id',
        'guild_settings',
    ];

    protected $casts = [
        'guild_settings' => 'array'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function discord_user() {
        return $this->belongsTo(DiscordAuthToken::class, 'id', 'discord_auth_id');
    }

    public function getSetting($key) {
        return Arr::get($this->guild_settings, $key);
    }

    public function setSetting($key, $value) {
        $settings = $this->guild_settings;

        $settings[$key] = $value;

        $this->guild_settings = $settings;

        $this->save();

        return $value;
    }
}
