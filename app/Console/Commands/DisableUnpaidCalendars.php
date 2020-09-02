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
    protected $description = 'Disables any calendars that require payment';

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
        $users = User::chunk(100, function($users){
            foreach ($users as $user) {
                if($user->subscriptions()->cancelled()->count() > 0 && $user->paymentLevel() == 'Free' && $user->calendars()->count() > 2) {
                    $user->calendars()->orderBy('date_created', 'ASC')->each(function($calendar, $index){
                        if($index > 1) {
                            $calendar->disabled = 1;
                            $calendar->save();
                        }
                    });
                }
            }
        });
    }
}
