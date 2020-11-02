<?php

namespace App\Console\Commands;

use App\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class DeleteAccounts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'accounts:yeet-requests';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deletes all accounts that have requested their account to be deleted';

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
        User::where('delete_requested_at', '<', Carbon::now()->subDays(14))->each(function($user){
            foreach($user->calendars as $key => $calendar) {
                foreach($calendar->events as $key => $event){
                    $event->comments->each->forceDelete();
                }
                $calendar->events->each->forceDelete();
                $calendar->event_categories->each->forceDelete();
                $calendar->invitations->each->forceDelete();
            }
            $user->calendars->each->forceDelete();
            $user->username = "DELETED";
            $user->email = "DELETED";
            $user->reg_ip = "DELETED";
            $user->deleted_at = now();
            $user->save();
        });
    }
}
