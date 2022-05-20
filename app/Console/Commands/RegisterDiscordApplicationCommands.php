<?php

namespace App\Console\Commands;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Console\Command;

class RegisterDiscordApplicationCommands extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'discord:register-commands {--list}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Registers Discord application commands via the Discord API.';

    protected $api_url = 'https://discord.com/api/v9';

    private $api_client;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->setupApiRequests();

        $res = $this->api_client->get(sprintf($this->api_url . '/applications/%s/commands', env('DISCORD_CLIENT_ID')));

        $existingCommands = collect(json_decode($res->getBody(), true));

        if($this->option('list')) {
            $this->info($existingCommands->toJson(JSON_PRETTY_PRINT));

            return 0;
        }

        $commands = collect(config('services.discord.global_commands'));

        // No commands? Just create them all and exit.
        if(!count($existingCommands)) {
            $results = $commands->map(function($command){
                dd('Would create newly');
                return $this->createCommand($command);
            });

            $this->info("Commands created.");
            $this->info($results->toJson(JSON_PRETTY_PRINT));
            return 0;
        }

        // Ok, so we have commands. Let's create any that don't exist.
        $commands->each(function($command) use ($existingCommands) {
            if(!$existingCommands->where('name', $command['name'])) {
                $this->createCommand($command);
            }
        });

        // Delete any that no longer exist, update all the ones that do.
        $existingCommands->each(function($command) {
            if(!$details = config('services.discord.global_commands.' . $command['name'])) {
                $this->deleteCommand($command['id']);
                return;
            }

            dump($this->updateCommand($command['id'], $details));
        });

        $this->info('Commands updated.');

        return 0;
    }

    private function createCommand($parameters)
    {
        try {
            $res = $this->api_client->post($this->api_url . '/applications/' . env('DISCORD_CLIENT_ID') . '/commands', [
                'json' => $parameters
            ]);
        } catch (ClientException $e) {
            if($e->hasResponse()) {
                $this->error($e->getResponse()->getBody());
            } else {
                $this->error($e->getMessage());
            }

            die(1);
        }

        if(!$res->getStatusCode() == 201) {
            $this->error('Discord returned wrong status code for create request on command ' . $parameters['name']);
        }

        return $res->getBody();
    }

    private function updateCommand($id, $parameters)
    {
        try {
            $res = $this->api_client->patch($this->api_url . '/applications/' . env('DISCORD_CLIENT_ID') . '/commands/' . $id, [
                'json' => $parameters
            ]);
        } catch (ClientException $e) {
            if($e->hasResponse()) {
                $this->error($e->getResponse()->getBody());
            } else {
                $this->error($e->getMessage());
            }

            die(1);
        }

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
            dump($res->getBody());
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
