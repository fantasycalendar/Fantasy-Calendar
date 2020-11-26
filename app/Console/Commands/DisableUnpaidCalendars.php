<?php

namespace App\Console\Commands;

use App\User;
use Illuminate\Console\Command;

class DisableUnpaidCalendars extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'calendar:demand-payment';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Disables any calendars that require payment, and unlinks any linked calendars';

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
        $users = User::whereHas('subscriptions')->whereHas('calendars')->chunk(100, function($users){
            foreach ($users as $user) {
                if(!$user->isPremium()) {
                    $max_calendars = $user->isEarlySupporter() ? 15 : 2;

                    $user->calendars()->orderBy('date_created', 'ASC')->each(function($calendar, $index) use ($max_calendars){
                        $calendar->disabled = ($index < $max_calendars) ? 0 : 1;
                        $calendar->parent_id = Null;
                        $calendar->parent_offset = Null;
                        $calendar->parent_link_date = Null;
                        $calendar->save();
                    });
                }
            }
        });
    }
}
