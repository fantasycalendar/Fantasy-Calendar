<?php

namespace App\Console\Commands;

use App\Calendar;
use App\Jobs\ConvertCalendarTo2Point0;
use App\OldCalendar;
use Illuminate\Console\Command;

class ConvertAllCalendars extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'calendar:convert {--hash=} {--force} {--die-on-error} {--show-skips}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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
     * @return mixed
     */
    public function handle()
    {
        $calendar =  OldCalendar::where('deleted', 0);

        if($this->option('hash')){
            $calendar->where('hash', $this->option('hash'));
        }

        $calendar->chunk(200, function($oldCalendars) {
            foreach($oldCalendars as $oldCalendar) {
                if(Calendar::hash($oldCalendar->hash)->exists()) {
                    if(!$this->option('force')) {
                        if($this->option('show-skips')) $this->info($oldCalendar->name . ' already exists! Use --force to force overwrite.');
                        continue;
                    }

                    Calendar::hash($oldCalendar->hash)->delete();
                }

                try{
                    $newCalendar = ConvertCalendarTo2Point0::dispatchNow($oldCalendar, Calendar::max('conversion_batch'));
                    $this->info('Converted ' . $newCalendar->name);
                } catch (\Throwable $e) {
                    if($this->option('die-on-error')) dd($e);
                    $this->error('Error converting ' . $oldCalendar->name . ':' . $e->getMessage());
                }
            }
        });
    }
}
