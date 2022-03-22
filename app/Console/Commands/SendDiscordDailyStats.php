<?php

namespace App\Console\Commands;

use App\Services\Statistics;
use App\Models\WebhookLog;
use Aws\Credentials\Credentials;
use Aws\Sns\SnsClient;
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
        $this->info('Sending stats to SNS');

        $statistics = new Statistics();
        $message = json_encode([
            'total_users' => $statistics->getUsersVerifiedToday(),
            'monthly_subscribers' => $statistics->getMonthlySubscribersToday(),
            'yearly_subscribers' => $statistics->getYearlySubscribersToday()
        ]);

        (new SnsClient([
            'version' => '2010-03-31',
            'region' => 'us-east-1',
        ]))->publish([
            'TopicArn' => env('SNS_TOPIC'),
            'Message' => $message,
            'Subject' => 'FC stats'
        ]);

        WebhookLog::create([
            'name' => 'Discord ' . now()->format('Y-m-d'),
            'json' => $message
        ]);

        $this->info('Stats sent to SNS.');

        return 0;
    }
}
