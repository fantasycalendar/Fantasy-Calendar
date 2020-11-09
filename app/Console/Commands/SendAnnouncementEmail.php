<?php

namespace App\Console\Commands;

use App\User;
use Illuminate\Console\Command;
use App\Mail\Announcement;
use Illuminate\Support\Facades\Mail;

class SendAnnouncementEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'announcement:send {--ids=} {--where=} {--force}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This sends the release announcement email';

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
        $users = User::whereNull('deleted_at')->where('has_sent_announcement', 0);

        if(!$this->option('where') && !$this->option('ids')) {
            $this->error("You must supply either a where clause (--where=\"date_register > '2020-01-01'\") or a list of IDs (--ids=1,2,3,500,10000,10)");
            exit(1);
        }

        if($where = $this->option('where')) {
            $users = $users->whereNull('agreed_at')->whereRaw($where);
        } else if($ids = $this->option('ids')) {
            $users = $users->whereIn('id', explode(',', $ids));
        }

        if(!$users->count()) {
            $this->error("No users matched your search. Check your SQL or your IDs and try again.");
            exit(1);
        }

        if($users->count() > 500 && !$this->confirm(sprintf('Found %d users, send them all?', $users->count()))) {
            $this->warn('Stopping here, no users were sent to.');
            exit(1);
        }

        $users->chunk(10, function($users){
            $users->each(function($user){
                if(!$user->has_sent_announcement || $this->option('force')){
                    Mail::to($user)->queue(new Announcement($user));
                    $user->has_sent_announcement = true;
                    $user->save();
                }
            });
            sleep(1);
        });
    }
}
