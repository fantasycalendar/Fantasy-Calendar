<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Notifications\DiscordDailyStats;
use Illuminate\Support\Facades\Notification;

class SendDiscordDailyStats extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'discord:daily-stats';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends a notification to discord containing daily user stats';

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
        try {
            Notification::route('discord', env('DISCORD_WEBHOOK'))->notify(new DiscordDailyStats);
        } catch (\Throwable $error) {
            return 1;
        }

        return 0;
    }
}
