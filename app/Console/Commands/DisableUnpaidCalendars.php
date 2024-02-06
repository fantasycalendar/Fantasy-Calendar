<?php

namespace App\Console\Commands;

use App\Models\Calendar;
use App\Models\User;
use DB;
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
            ->whereHas('user.subscriptions', function (Builder $query) {
                $query->where('stripe_status', '=', 'active');
            })
            ->update([
                'disabled' => false
            ]);

        if ($updated > 0) {
            $this->info("Re-enabled " . $updated . " calendars.");
        }

        $this->disableCalendarsWhen('<', '2020-11-08', 15);
        $this->disableCalendarsWhen('>=', '2020-11-08', 2);
    }

    private function disableCalendarsWhen(string $operator, string $date, int $max_calendars)
    {
        $query = User::with('subscriptions', 'calendars')
            ->where('beta_authorised', '=', false)
            ->where('created_at', $operator, $date)
            ->whereHas('subscriptions')
            ->whereDoesntHave('subscriptions', function (Builder $query) {
                $query->active();
            })
            ->whereHas('calendars', function (Builder $query) {
                $query->where('disabled', '!=', true);
            }, '>', $max_calendars);

        $count = $query->count();

        if ($count === 0) {
            logger()->info("No users found exceeding maximum of " . $max_calendars . " calendars.");

            return;
        }

        logger()->info("Disabling calendars for $count users who have more than " . $max_calendars . " calendars.");

        $query->chunk(100, function ($users) use ($max_calendars) {
            foreach ($users as $user) {
                $this->info('Processing ' . $user->username);

                $disableIds = $user->calendars
                    ->sortBy('created_at')
                    ->take($user->calendars->count() - $max_calendars)
                    ->pluck('id');

                $user->calendars()
                    ->whereIn('id', $disableIds)
                    ->update([
                        'disabled' => true,
                        'parent_id' => null,
                        'parent_offset' => null,
                        'parent_link_date' => null,
                    ]);
            }
        });
    }
}
