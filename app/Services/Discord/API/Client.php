<?php

namespace App\Services\Discord\API;

use App\Services\Discord\Commands\Command\Response;
use GuzzleHttp\Client as HttpClient;

class Client
{
    private string $application_id;
    private $application_secret;
    protected $api_url = 'https://discord.com/api/v9';
    protected HttpClient $api_client;

    public function __construct()
    {
        $this->application_id = config('services.discord.client_id');
        $this->application_secret = config('services.discord.client_secret');
        $this->prepareForRequests();
    }

    public function followupMessage(Response $response, $token)
    {
        logger()->debug(json_encode($response->getMessage()));
        $this->patch(sprintf('%s/webhooks/%s/%s/messages/@original', $this->api_url, $this->application_id, $token), [
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
        return $this->request($url,'');
    }

    private function post($url, $payload)
    {
        $this->request($url, $payload, 'POST');
    }

    private function patch($url, $payload)
    {
        $this->request($url, $payload, 'PATCH');
    }

    private function request($url, $payload, $method = 'GET')
    {
        return $this->api_client->request($method, $url, $payload);
//        try {
//        } catch (\Throwable $e) {
//
//        }
    }
}
