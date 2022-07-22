<?php

namespace App\Console;

use App\Console\Commands\DownCommand;
use App\Console\Commands\UpCommand;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        DownCommand::class,
        UpCommand::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        if(app()->environment('development')) {
            return;
        }

        $schedule->command('clean:authtokens')
                 ->daily()->onOneServer();

        $schedule->command('clean:invites')
                 ->daily()->onOneServer();

        $schedule->command('discord:daily-stats')
                 ->daily()->onOneServer();

        $schedule->command('accounts:yeet-warning')
                ->daily()->onOneServer();

        $schedule->command('accounts:yeet')
                 ->daily()->onOneServer();

        $schedule->command('calendar:demand-payment')
                 ->everyFifteenMinutes()->onOneServer();

        $schedule->command('queue:prune-batches')->daily();

        $schedule->command('calendar:advance')->everyMinute();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
