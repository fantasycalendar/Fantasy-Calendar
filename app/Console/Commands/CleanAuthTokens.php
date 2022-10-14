<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use \App\Models\Authtoken;

class CleanAuthTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clean:authtokens';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleans up the auth_tokens table, removing tokens that have expired.';

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
     * @return mixed
     */
    public function handle()
    {
        $deletedTokens = Authtoken::isExpired()->delete();

        $this->info('Deleted ' . $deletedTokens . ' auth tokens that were expired.');
    }
}
