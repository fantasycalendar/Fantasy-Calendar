<?php

namespace App\Services\Discord\API;

use App\Services\Discord\Commands\Command\Response;
use App\Services\Discord\Exceptions\DiscordException;
use GuzzleHttp\Client as HttpClient;

class Client
{
    private string $application_id;
    private $application_secret;
    protected $api_url = 'https://discord.com/api/v9';
    protected HttpClient $api_client;

    public function __construct(private $passErrors = false)
    {
        $this->application_id = config('services.discord.client_id');
        $this->application_secret = config('services.discord.client_secret');
        $this->prepareForRequests();
    }

    public function hitWebhook(string $message, string $webhookUrl)
    {
        return $this->post($webhookUrl . "?wait=true", [
            'content' => $message,
            'username' => config('app.name'),
            'avatar_url' => 'https://app.fantasy-calendar.com/resources/apple-touch-icon.png'
        ]);
    }

    public function updateWebhookMessage(string $text, mixed $webhookUrl, mixed $messageId)
    {
        return $this->patch($webhookUrl . '/messages/' . $messageId, [
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

    private function post($url, $payload)
    {
        return $this->request($url, [
            'json' => $payload
        ], 'POST');
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
