<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use App\Mail\AccountDeleted;
use Illuminate\Support\Facades\Mail;

use Str;
use Hash;

class DeleteAccounts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'accounts:yeet';

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
        $users = User::where('delete_requested_at', '<', Carbon::now()->subDays(14))->whereNull('deleted_at');
        $deleted = $users->count();

        $users->each(function($user){
            foreach($user->calendars as $key => $calendar) {
                foreach($calendar->events as $key => $event){
                    $event->comments->each->delete();
                }
                $calendar->events->each->delete();
                $calendar->event_categories->each->delete();
                $calendar->invitations->each->delete();
            }
            $user->calendars->each->delete();
            $user->username = Str::limit('DELETED-' . Hash::make(now()->format('Y-m-d H:i:s')), 32, '');
            $user->reg_ip = "DELETED";
            $user->delete();
            $user->save();

            try {
                Mail::to($user)->send(new AccountDeleted($user));
            } catch (\Swift_TransportException $e) {
                // Sleep 5 seconds and try again if there was a transportexception.
                sleep(5);
                Mail::to($user)->send(new AccountDeleted($user));
            }

            sleep(1);
        });

        if($deleted > 0) {
            $this->info($deleted . " user accounts deleted. =(");
        } else {
            $this->info("No user accounts deleted today! Hooray!");
        }
    }
}
