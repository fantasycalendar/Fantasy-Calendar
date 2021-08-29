<?php

namespace App\Console\Commands;

use App\Calendar;
use Illuminate\Console\Command;

class CalendarChangeWatch extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'change:watch {hash}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Watches for calendar changes and displays the resulting dates';

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
        $calendar = Calendar::hash($this->argument('hash'))->firstOrFail();
        $last_changed = null;

        do {
            sleep(2);

            $calendar = $calendar->fresh();

            if($calendar->last_dynamic_change === $last_changed) continue;

            $last_changed = $calendar->last_dynamic_change;

            $headings = [
                'name',
                'current_date',
                'current_time',
            ];

            $output = $calendar->children()
                ->get()
                ->map->only($headings);

            $this->newLine(4);
            $this->table($calendar->only($headings), $output);

        } while (true);
    }
}
