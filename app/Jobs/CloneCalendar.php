<?php

namespace App\Jobs;

use App\Models\Calendar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CloneCalendar implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $sourceCalendar;

    public $newName;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Calendar $calendar, $newName)
    {
        $this->newName = $newName;
        $this->sourceCalendar = $calendar;
    }

    /**
     * Execute the job.
     *
     * @return array
     */
    public function handle()
    {
        $newCalendar = $this->sourceCalendar->replicate();
        $newCalendar->name = $this->newName;
        $newCalendar->push();

        $newCalendar->event_categories = [];
        $categoryIds = [];

        foreach($this->sourceCalendar->event_categories as $event_category) {
            $newCategory = $event_category->replicate();
            $newCategory->calendar_id = $newCalendar->id;
            $newCategory->push();

            $categoryIds[$event_category->id] = $newCategory;
        }

        foreach($this->sourceCalendar->events as $event) {
            $newEvent = $event->replicate();
            $newEvent->calendar_id = $newCalendar->id;

            if($event->event_category_id > 0 && array_key_exists($event->event_category_id, $categoryIds)) {
                $newEvent->event_category_id = $categoryIds[$event->event_category_id]->id;
            }

            $newEvent->push();
        }

        return [
            'success' => true,
            'message' => 'Calendar cloned successfully',
            'hash' => $newCalendar->hash,
        ];
    }
}
