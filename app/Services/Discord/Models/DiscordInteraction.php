<?php

namespace App\Services\Discord\Models;

use App\Models\Calendar;
use App\Services\Discord\API\Client;
use App\Services\Discord\Commands\Command\Response;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

/**
 * 
 *
 * @method static create(array $array)
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $snowflake
 * @property string|null $parent_snowflake
 * @property string|null $discord_id
 * @property int|null $user_id
 * @property int|null $calendar_id
 * @property string $type
 * @property array $data
 * @property string|null $guild_id
 * @property string|null $channel_id
 * @property array $discord_user
 * @property array $payload
 * @property array|null $response
 * @property string|null $responded_at
 * @property int $needs_follow_up
 * @property int $version
 * @property-read \App\Services\Discord\Models\DiscordAuthToken|null $auth_token
 * @property-read Calendar|null $calendar
 * @property-read string $called_command
 * @property-read mixed $latest_content
 * @property-read mixed $message_text
 * @property-read Collection $options
 * @property-read string $token
 * @property-read DiscordInteraction|null $parent
 * @property-read User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction latestFor(\App\Models\Calendar $calendar)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction needsFollowUp()
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction query()
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction type($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereCalendarId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereChannelId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereDiscordId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereDiscordUser($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereGuildId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereNeedsFollowUp($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereParentSnowflake($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction wherePayload($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereRespondedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereResponse($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereSnowflake($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DiscordInteraction whereVersion($value)
 * @mixin \Eloquent
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
