<?php

namespace App\Services\Discord\Models;

use App\Calendar;
use App\Services\Discord\API\Client;
use App\Services\Discord\Commands\Command\Response;
use App\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

/**
 * @method static create(array $array)
 */
class DiscordInteraction extends Model
{
    use HasFactory;

    public const TYPES = [
        'command' => 2,
        'component' => 3
    ];

    protected $fillable = [
        'snowflake',
        'parent_snowflake',
        'discord_id',
        'type',
        'data',
        'guild_id',
        'channel_id',
        'discord_user',
        'version',
        'calendar_id',
        'payload',
        'response',
        'responded_at',
        'needs_follow_up',
    ];

    protected $casts = [
        'data' => 'array',
        'discord_user' => 'array',
        'payload' => 'array',
        'response' => 'array',
    ];

    protected $dateFormat = 'Y-m-d H:i:s';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function auth_token(): BelongsTo
    {
        return $this->belongsTo(DiscordAuthToken::class, 'discord_id');
    }

    public function calendar(): BelongsTo
    {
        return $this->belongsTo(Calendar::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(static::class, 'parent_snowflake', 'snowflake');
    }

    public function getCalledCommandAttribute(): string
    {
        return self::getCalledCommand($this->data);
    }

    public function scopeLatestFor($query, Calendar $calendar)
    {
        return $query->where('calendar_id', $calendar->id)
            ->latest('created_at');
    }

    public function getMessageTextAttribute()
    {
        return Arr::get($this->payload, 'message.content');
    }

    public function getTokenAttribute(): string
    {
        return Arr::get($this->payload, 'token');
    }

    public function getLatestContentAttribute()
    {
        return (new Client())->getMessageContent($this->parent->snowflake);
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

    /**
     * @return Collection
     */
    public function getOptionsAttribute(): Collection
    {
        return self::getOptions($this->data);
    }

    /**
     * Formats our command options into something we can call associatively
     *
     * @param $data
     * @return Collection
     */
    protected static function getOptions($data): Collection
    {
        switch (Arr::get($data, 'type')) {
            case 1:
            case 2:
                return (!Arr::has($data, 'options'))
                    ? collect()
                    : collect(Arr::get($data, 'options'))->mapWithKeys(function($option){
                        return self::getOptions($option);
                    });
            case 3:
            case 4:
                return collect([$data['name'] => $data['value']]);
            default:
                return collect();
        }
    }

    /**
     * @param $response
     * @return bool
     */
    public function respondedWith($response): bool
    {
        $response_array = ($response instanceof Response)
            ? $response->getMessage()
            : $response;
        $responded_at = now();

        return $this->update(compact('response_array', 'responded_at'));
    }

    public function scopeType($query, $value)
    {
        return $query->where('type', '=', self::TYPES[$value]);
    }

    public function scopeNeedsFollowUp($query)
    {
        return $query->whereNeedsFollowUp(true)
                     ->where('created_at', '>', now()->subMinutes(15));
    }
}
