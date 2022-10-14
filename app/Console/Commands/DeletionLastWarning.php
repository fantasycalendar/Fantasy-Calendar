<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\User;
use App\Mail\AccountDeletionLastWarning;
use Illuminate\Support\Facades\Mail;

class DeletionLastWarning extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'accounts:yeet-warning';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends an email out to everyone who will get their account deleted tomorrow';

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
        $users = User::where('delete_requested_at', '<', now()->subDays(13))->where('delete_requested_at', '>', now()->subDays(14))->whereNull('deleted_at');
        $warned = $users->count();

        $users->each(function($user){
            Mail::to($user)->send(new AccountDeletionLastWarning($user));
        });

        $this->info("Account deletion warnings sent to " . $warned . " users.");
    }
}
