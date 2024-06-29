<?php

namespace App\Services\Discord\Models;

use App\Models\Calendar;
use App\Models\User;
use App\Services\Discord\API\Client;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string $access_token
 * @property string $webhook_id
 * @property string $webhook_token
 * @property string $refresh_token
 * @property string $expires_in
 * @property int $active
 * @property int $error
 * @property string|null $error_message
 * @property int $calendar_id
 * @property int $user_id
 * @property int $discord_auth_token_id
 * @property int $discord_guild_id
 * @property int $persistent_message
 * @property string|null $persistent_message_id
 * @property string $channel_id
 * @property int $type
 * @property string|null $avatar
 * @property string|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read Calendar|null $calendar
 * @property-read \App\Services\Discord\Models\DiscordAuthToken|null $discord_auth
 * @property-read \App\Services\Discord\Models\DiscordGuild|null $guild
 * @property-read User|null $user
 * @method static Builder|DiscordWebhook active()
 * @method static Builder|DiscordWebhook newModelQuery()
 * @method static Builder|DiscordWebhook newQuery()
 * @method static Builder|DiscordWebhook query()
 * @method static Builder|DiscordWebhook whereAccessToken($value)
 * @method static Builder|DiscordWebhook whereActive($value)
 * @method static Builder|DiscordWebhook whereAvatar($value)
 * @method static Builder|DiscordWebhook whereCalendarId($value)
 * @method static Builder|DiscordWebhook whereChannelId($value)
 * @method static Builder|DiscordWebhook whereCreatedAt($value)
 * @method static Builder|DiscordWebhook whereDeletedAt($value)
 * @method static Builder|DiscordWebhook whereDiscordAuthTokenId($value)
 * @method static Builder|DiscordWebhook whereDiscordGuildId($value)
 * @method static Builder|DiscordWebhook whereError($value)
 * @method static Builder|DiscordWebhook whereErrorMessage($value)
 * @method static Builder|DiscordWebhook whereExpiresIn($value)
 * @method static Builder|DiscordWebhook whereId($value)
 * @method static Builder|DiscordWebhook whereName($value)
 * @method static Builder|DiscordWebhook wherePersistentMessage($value)
 * @method static Builder|DiscordWebhook wherePersistentMessageId($value)
 * @method static Builder|DiscordWebhook whereRefreshToken($value)
 * @method static Builder|DiscordWebhook whereType($value)
 * @method static Builder|DiscordWebhook whereUpdatedAt($value)
 * @method static Builder|DiscordWebhook whereUserId($value)
 * @method static Builder|DiscordWebhook whereWebhookId($value)
 * @method static Builder|DiscordWebhook whereWebhookToken($value)
 * @mixin \Eloquent
 */
class DiscordWebhook extends Model
{
    use HasFactory;

    protected $guarded = [];

    public static function fromPayload(mixed $body)
    {
        return [
            'name' => $body['webhook']['name'],
            'access_token' => $body['access_token'],
            'refresh_token' => $body['refresh_token'],
            'expires_in' => $body['expires_in'],
            'active' => 1,
            'channel_id' => $body['webhook']['channel_id'],
            'webhook_token' => $body['webhook']['token'],
            'webhook_id' => $body['webhook']['id'],
            'avatar' => $body['webhook']['avatar'],
            'type' => $body['webhook']['type'],
            'user_id' => auth()->user()->id,
            'discord_auth_token_id' => auth()->user()->discord_auth->id,
            'discord_guild_id' => DiscordGuild::where('guild_id', $body['webhook']['guild_id'])
                ->firstOrFail()
                ->id,
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function calendar()
    {
        return $this->belongsTo(Calendar::class);
    }

    public function discord_auth()
    {
        return $this->belongsTo(DiscordAuthToken::class);
    }

    public function guild()
    {
        return $this->belongsTo(DiscordGuild::class);
    }

    public function scopeActive(Builder $query)
    {
        return $query->where('active', 1);
    }

    public function post(string $content)
    {
        logger()->debug($this->name . " - webhook updating persistent message.");

        if($this->persistent_message) {
            $client = new Client();

            if($this->persistent_message_id) {
                try {
                    $client->updateWebhookMessage(
                        $content,
                        $this->webhook_id,
                        $this->webhook_token,
                        $this->persistent_message_id
                    );

                    return;
                } catch (\Throwable $e) {
                    logger()->error($e->getMessage());

                    $this->update([
                        'persistent_message_id' => null
                    ]);
                }
            }

            try {
                $response = $client->hitWebhook($content, $this->webhook_id, $this->webhook_token);
                $payload = json_decode($response->getBody()->getContents(), true);

                $this->update([
                    'persistent_message_id' => $payload['id']
                ]);
            } catch (\Throwable $e) {
                $this->update([
                    'persistent_message' => false,
                    'error' => 1,
                    'error_message' => $e->getMessage(),
                    'active' => false
                ]);
            }
        }
    }
}
