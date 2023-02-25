<?php

namespace App\Console\Commands;

use App\Models\Calendar;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;

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
        $updated = Calendar::with(['user', 'user.subscriptions'])
            ->where('disabled', '=', true)
            ->whereHas('user.subscriptions', function(Builder $query) {
                $query->where('stripe_status', '=', 'active');
            })
            ->update([
                'disabled' => false
            ]);

        if($updated > 0) {
            $this->info("Re-enabled " . $updated . " calendars.");
        }

        User::with('subscriptions')
            ->whereHas('subscriptions', function(Builder $query) {
                $query->where('stripe_status', '!=', 'active');
            })
            ->whereHas('calendars', function(Builder $query){
                $query->where('disabled', '=', true);
            }, '>', '2')
            ->chunk(100, function($users){
                foreach ($users as $user) {
                    $this->debug('Processing ' . $user->username);

                    $max_calendars = $user->isEarlySupporter() ? 15 : 2;

                    $user->calendars()->orderBy('date_created', 'ASC')->each(function($calendar, $index) use ($max_calendars){
                        $calendar->disabled = ($index < $max_calendars) ? 0 : 1;
                        $calendar->parent_id = Null;
                        $calendar->parent_offset = Null;
                        $calendar->parent_link_date = Null;
                        $calendar->save();
                    });
                }
            });
    }
}
