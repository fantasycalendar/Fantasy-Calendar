<?php

namespace App\Console\Commands;

use App\Calendar;
use App\Jobs\ConvertCalendarTo2Point0;
use App\OldCalendar;
use App\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MigrateUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'calendar:migrate-users {--ids=} {--where=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mass migrate users with a query or a list of IDs';
    /**
     * @var int
     */
    private $batch;

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
     * @param User $user
     * @return void
     */
    public function handle(User $userModel)
    {
        $this->batch = Calendar::max('conversion_batch') + 1 ?? 1;

        if(!$this->option('where') && !$this->option('ids')) {
            $this->error("You must supply either a where clause (--where=\"date_register > '2020-01-01'\") or a list of IDs (--ids=1,2,3,500,10000,10)");
            exit(1);
        }

        if($where = $this->option('where')) {
            $users = $userModel->whereRaw($where)->where('migrated', 0)->get();
        } else if($ids = $this->option('ids')) {
            $users = $userModel->where('migrated', 0)->whereIn('id', explode(',', $ids))->get();
        }

        if(!$users->count()) {
            $this->error("No users matched your search. Check your SQL or your IDs and try again.");
            exit(1);
        }

        if($users->count() > 500 && !$this->confirm(sprintf('Found %d users, convert them all?', $users->count()))) {
            $this->warn('Stopping here, no users were converted.');
            exit(1);
        }

        $bar = $this->output->createProgressBar($users->count());

        $bar->start();

        foreach($users as $user) {
            foreach(OldCalendar::where('user_id', $user->id)->where('deleted', 0)->get() as $calendar) {
                ConvertCalendarTo2Point0::dispatch($calendar, $this->batch);
            }

            $user->migrated = 1;

            if($user->api_token == null) {
                $user->api_token = Str::random(60);
            }

            $user->save();

            $bar->advance();
        }

        $bar->finish();

        $this->info(sprintf("\nMigration finished! %s %s were migrated.", $users->count(), Str::plural('user', $users->count())));
    }
}
