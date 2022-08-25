<?php

namespace App\Services\Discord\API;

use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Exceptions\DiscordException;
use GuzzleHttp\Client as HttpClient;

class Client
{
    private string $application_id;
    private $application_secret;
    protected $api_url = 'https://discord.com/api/v10';
    protected HttpClient $api_client;

    public function __construct(private $passErrors = false)
    {
        $this->application_id = config('services.discord.client_id');
        $this->application_secret = config('services.discord.client_secret');
        $this->prepareForRequests();
    }

    public function webhookAuthTokenExchange(string $code)
    {
        $results = $this->post(sprintf('%s/oauth2/token', $this->api_url), [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'client_id' => $this->application_id,
            'client_secret' => $this->application_secret,
            'redirect_uri' => route('discord.webhookCallback'),
        ], 'form_params');

        $contents = $results->getBody()->getContents();

        return json_decode($contents, true);
    }

    public function hitWebhook(string $message, string $webhookId, string $webhookToken)
    {
        return $this->post(sprintf("%s/webhooks/%s/%s", $this->api_url, $webhookId, $webhookToken) . "?wait=true", [
            'content' => $message,
            'username' => config('app.name'),
            'avatar_url' => 'https://app.fantasy-calendar.com/resources/apple-touch-icon.png'
        ]);
    }

    public function updateWebhookMessage(string $text, string $webhookId, string $webhookToken, mixed $messageId)
    {
        return $this->patch(sprintf("%s/webhooks/%s/%s/messages/%s", $this->api_url, $webhookId, $webhookToken, $messageId), [
            'content' => $text
        ]);
    }

    public function followupMessage(Response $response, $token)
    {
        logger()->debug(json_encode($response->getMessage()));
        return $this->patch(sprintf('%s/webhooks/%s/%s/messages/@original', $this->api_url, $this->application_id, $token), [
            'json' => $response->getMessage()['data']
        ]);
    }

    public function getMessageContent($token)
    {
        return $this->get(sprintf('%s/webhooks/%s/%s/messages/@original', $this->api_url, $this->application_id, $token));
    }

    private function prepareForRequests()
    {
        $this->api_client = new HttpClient();
    }

    private function get($url)
    {
        return $this->request($url,[]);
    }

    private function post($url, $payload, $contentType = 'json')
    {
        if($contentType != 'raw') {
            $payload = [
                $contentType => $payload
            ];
        }

        return $this->request($url, $payload, 'POST');
    }

    private function patch($url, $payload)
    {
        return $this->request($url, [
            'json' => $payload
        ], 'PATCH');
    }

    private function request($url, $payload, $method = 'GET')
    {
        logger()->debug($url);
        logger()->debug(json_encode($payload));
        logger()->debug($method);
        try {
            return $this->api_client->request($method, $url, $payload);
        } catch (\Throwable $e) {
            if(!$this->passErrors) {
                throw new DiscordException($e->getResponse()->getBody()->getContents(true));
            }

            throw $e;
        }
    }
}
