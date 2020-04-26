<?php

namespace App\Console\Commands;

use App\Calendar;
use App\OldCalendar;
use Illuminate\Console\Command;

class ConvertCalendarTo2Point0 extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:name';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * The old_calendar we're converting
     */
    protected $old_calendar;

    /**
     * Create a new command instance.
     * @param OldCalendar $calendar
     *
     * @return void
     */
    public function __construct(OldCalendar $calendar)
    {
        $this->old_calendar = $calendar;

        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $calendar = new Calendar();
        $old = json_decode($this->old_calendar->data);

        $dynamic = [];
        $static = [];
        $events = [];
        $categories = [];

        $calendar->name = $old->name;

        $dynamic['year'] = $old->year+1;
        $dynamic['timespan'] = $old->month-1;
        $dynamic['day'] = $old->day;

        $static['year_data'] = [
            'first_day' => $old->first_day+1,
            'global_week' => $old->weekdays,
            'overflow' => $old->overflow,
            'timespans' => []
        ];

        foreach($old->months as $index => $month) {
            $static['year_data']['timespans'][] = [
                'name' => $month,
                'type' => 'month',
                'interval' => 1,
                'offset' => 0,
                'length' => $old->month__len[$index]
            ];
        }

        foreach($old->moons as $index => $moon) {
            $static['moons'][] = [
                'name' => $moon,
                'cycle' => $old->lunar_cyc[$index],
                'shift' => $old->lunar_shf[$index],
                'granularity' => $this->determineMoonGranularity($old->lunar_cyc[$index]),
                'color' => $old->lunar_color[$index],
                'hidden' => false,
                'custom_phase' => false
            ];
        }

        foreach($old->events as $event) {

        }

    }

    public function convertOldEvent($event) {
        
    }

    public function determineMoonGranularity($cycle) {
        if($cycle >= 40) return 40;
        if($cycle >= 24) return 24;
        if($cycle >= 8) return 8;
        return 4;
    }
}
