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
    protected $signature = 'announcement:send';

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
        User::whereNull('agreed_at')->chunk(10, function($users){
            $users->each(function($user){
                if(!$user->has_sent_announcement){
                    Mail::to($user)->queue(new Announcement($user));
                    $user->has_sent_announcement = true;
                    $user->save();
                }
            });
        });
    }
}
