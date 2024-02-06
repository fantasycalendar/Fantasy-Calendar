<?php

namespace App\Services\Discord\Http\Controllers;

use App\Services\Discord\Models\DiscordWebhook;

class WebhookApiController extends \Illuminate\Routing\Controller
{
    public function update(DiscordWebhook $discordWebhook) {
        if(auth()->user()->cannot('update', $discordWebhook)) {
            return response([
                'error' => true,
                'message' => 'This action is unauthorized.'
            ], 403);
        }

        $discordWebhook->update(request()->only([
            'name',
            'active'
        ]));

        return response()->json([
            'success' => true,
            'webhook' => $discordWebhook->toArray()
        ]);
    }

    public function delete(DiscordWebhook $discordWebhook) {
        if(auth()->user()->cannot('delete', $discordWebhook)) {
            return response([
                'error' => true,
                'message' => 'This action is unauthorized.'
            ], 403);
        }

        $discordWebhook->delete();

        return [
            'success' => true
        ];
    }
}
