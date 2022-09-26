<?php

namespace App\Services\Discord\Models;

use App\Models\Calendar;
use App\Models\User;
use App\Services\Discord\API\Client;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        logger()->info($this->name . " - webhook updating persistent message.");

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
