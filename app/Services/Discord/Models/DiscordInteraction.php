<?php

namespace App\Services\Discord\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
