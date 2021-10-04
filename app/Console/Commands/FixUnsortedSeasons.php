<?php

namespace App\Console\Commands;

use App\Calendar;
use Illuminate\Console\Command;

class FixUnsortedSeasons extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'calendars:fix-seasons {--hash=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fixes calendars that have unsorted seasons, and adjusts their events accordingly';

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
        $calendar = Calendar::whereNull('deleted_at');

        if($this->option('hash')){
            $calendar->where('hash', $this->option('hash'));
        }

        $calendar->where('static_data', 'like', '%periodic_seasons":false%')
            ->where('static_data', 'like', '%"seasons":{"data":[{"%');

        $calendar->chunk(200, function($calendars) {

            foreach ($calendars as $calendar) {

                $static_data = $calendar->static_data;

                $sortedSeasons = collect($static_data['seasons']['data'])
                    ->map(function($season, $index){
                        $season['index'] = $index;
                        return $season;
                    })->sort(function($a, $b){
                        if($a['timespan'] != $b['timespan']){
                            return $a['timespan'] - $b['timespan'];
                        }
                        return $a['day'] - $b['day'];
                    })->values();

                $alreadySorted = true;
                foreach($sortedSeasons as $index => $season){
                    if($index !== $season['index']){
                        $alreadySorted = false;
                        break;
                    }
                }
                if($alreadySorted) continue;

                $calendar->events->each(function($event) use ($sortedSeasons) {
                    $eventData = $event['data'];
                    $eventData['conditions'] = $this->fixSeasonConditions($eventData['conditions'], $sortedSeasons);
                    $event['data'] = $eventData;
                    $event->save();
                });

                $sortedSeasons = $sortedSeasons->map(function($season){
                    unset($season['index']);
                    return $season;
                });

                $static_data['seasons']['data'] = $sortedSeasons;

                $calendar->static_data = $static_data;

                $calendar->save();

            }
        });
    }

    private function fixSeasonConditions($conditions, $sortedSeasons){

        foreach($conditions as $index => $condition){

            if(count($condition) == 2){
                $conditions[$index][1] = $this->fixSeasonConditions($condition[1], $sortedSeasons);
            }else if(count($condition) == 3 && $condition[0] === "Season" && ($condition[1] === "0" || $condition[1] === "1")){
                $conditions[$index][2][0] = strval($sortedSeasons->pluck('index')->search($condition[2][0]));
            }

        }

        return $conditions;

    }
}
