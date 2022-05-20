<?php


namespace App\Services\Discord\Models;


use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

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
