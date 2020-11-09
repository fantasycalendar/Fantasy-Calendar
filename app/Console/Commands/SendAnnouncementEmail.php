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
        $users = User::whereNull('agreed_at');

        if($where = $this->option('where')) {
            $users = $users->whereRaw($where);
        } else if($ids = $this->option('ids')) {
            $users = $users->whereIn('id', explode(',', $ids));
        }

        if($users->count() > 500 && !$this->confirm(sprintf('Found %d users, convert them all?', $users->count()))) {
            $this->warn('Stopping here, no users were converted.');
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
