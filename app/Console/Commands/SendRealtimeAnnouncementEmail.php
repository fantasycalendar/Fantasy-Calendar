<?php

namespace App\Console\Commands;

use App\Mail\DiscordAnnouncement;
use App\Mail\RealTimeAnnouncement;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendRealtimeAnnouncementEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'realtime-announcement:send {--ids=} {--where=} {--force}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends realtime advancement announcement email';

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
     * @return void
     */
    public function handle()
    {
        $users = User::where('has_sent_announcement', '=', false);

        if ($where = $this->option('where')) {
            $users = $users->whereNull('agreed_at')->whereRaw($where);
        } else if($ids = $this->option('ids')) {
            $users = $users->whereIn('id', explode(',', $ids));
        } else {
            $users = $users->marketingEnabled();
        }

        $total = $users->count();

        if (!$total) {
            $this->error("No users matched your search. Check your SQL or your IDs and try again.");
            exit(1);
        }

        if (!$this->option('force') && $total > 500 && !$this->confirm(sprintf('Found %d users, send them all?', $total))) {
            $this->warn('Stopping here, no users were sent to.');
            exit(1);
        }

        $users->each(function($user){
            Mail::to($user)->queue(new RealTimeAnnouncement($user));
        });


        $this->info("\nEmail sent to " . $total);
    }
}
