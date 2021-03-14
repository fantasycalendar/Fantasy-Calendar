<?php

namespace App\Console\Commands;

use GuzzleHttp\Client;
use Illuminate\Console\Command;

class RegisterDiscordApplicationCommands extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'discord:register-commands';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Registers Discord application commands via the Discord API.';

    protected $api_url = 'https://discord.com/api/v8';

    private $api_client;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->setupApiRequests();

        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $res = $this->api_client->get(sprintf($this->api_url . '/applications/%s/commands', env('DISCORD_CLIENT_ID')));

        $existingCommands = collect(json_decode($res->getBody(), true));
        $existingCommands->each(function($command){
            $this->deleteCommand($command['id']);
        });

        $commands = collect(config('services.discord.global_commands'));

        $results = $commands->map(function($command){
            return $this->createCommand($command);
        });

        $this->info($results);

        return 0;
    }

    private function createCommand($parameters)
    {
        $res = $this->api_client->post($this->api_url . '/applications/' . env('DISCORD_CLIENT_ID') . '/commands', [
            'json' => $parameters
        ]);

        if(!$res->getStatusCode() == 201) {
            $this->error('Discord returned wrong status code for create request on command ' . $parameters['name']);
        }

        return json_encode($res->getBody());
    }

    private function deleteCommand($id)
    {
        $res = $this->api_client->delete($this->api_url . '/applications/' . env('DISCORD_CLIENT_ID') . '/commands/' . $id);

        if(!$res->getStatusCode() == 204) {
            $this->error('Discord returned wrong status code for delete request on command ' . $id . ".\nResponse body was:");
            $this->error($res->getBody());
        }
    }

    private function setupApiRequests()
    {
        $client = new Client();

        $tokenRequest = $client->post($this->api_url . '/oauth2/token',[
            'auth' => [
                env('DISCORD_CLIENT_ID'),
                env('DISCORD_CLIENT_SECRET')
            ],
            'form_params' => [
                'grant_type' => 'client_credentials',
                'scope' => 'identify connections applications.commands applications.commands.update'
            ]
        ])->getBody();

        $token = json_decode($tokenRequest)->access_token;

        $this->api_client = new Client([
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ]
        ]);
    }
}
