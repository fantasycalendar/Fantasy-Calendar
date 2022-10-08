<?php

namespace App\Jobs;

use App\Models\Calendar;
use App\Models\EventCategory;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

class PrepCalendarForExport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(public Calendar $calendar)
    {
    }

    /**
     * Execute the job.
     *
     * @return array
     */
    public function handle()
    {
        $categorymap = collect();
        $calendarId = Str::slug($this->calendar->name);
        
        $categories = $this->calendar
            ->event_categories
            ->map(function(EventCategory $category) use ($categorymap, $calendarId) {
                $categoryAttributes = $category->toArray();
                $categoryName = Str::slug($category->name);
                $categorymap->put($category->id, $categoryName);
            
                unset($categoryAttributes['id']);

                $categoryAttributes['id'] = $categoryName;
                $categoryAttributes['calendar_id'] = $calendarId;
            
                return $categoryAttributes; 
            });
        
        $events = $this->calendar
            ->events
            ->map(function($event) use ($categorymap, $calendarId) {
                $eventAttributes = $event->toArray();
                
                $eventAttributes['event_category_id'] = $categorymap[$event->event_category_id] ?? -1;
                $eventAttributes['calendar_id'] = $calendarId;
                
                return $eventAttributes; 
            });


        return [
            'name' => $this->calendar->name,
            'static_data' => $this->calendar->static_data,
            'dynamic_data' => $this->calendar->dynamic_data,
            'events' => $events,
            'categories' => $categories
        ];
    }
}
