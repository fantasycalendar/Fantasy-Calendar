<?php

namespace App\Console\Commands;

use App\Models\CalendarInvite;
use Illuminate\Console\Command;

class CleanExpiredInvitations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clean:invites';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleans out calendar invitations that have expired';

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
        $invites = CalendarInvite::withTrashed()->get();

        foreach($invites as $key => $invite){
            if($invite->expires_on < now() || $invite->handled || $invite->deleted_at){
                $invite->forceDelete();
            }
        }
    }
}
