<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

use App\EventCategory;

class SaveEventCategories implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($categories, $calendarId)
    {
        $this->categories = $categories;
        $this->calendarId = $calendarId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $categoryids = [];

        foreach($this->categories as $sort_by => $category) {
            $category['sort_by'] = $sort_by;

            if(array_key_exists('id', $category) && is_numeric($category['id'])) {
                $categoryids[] = $category['id'];
                $category['category_settings'] = json_encode($category['category_settings']);
                $category['event_settings'] = json_encode($category['event_settings']);
                EventCategory::where('id', $category['id'])->update($category);
            } else {
                $category['calendar_id'] = $this->calendarId;
                $stringid = $category['id'];
                unset($category['id']);

                $category = EventCategory::Create($category);

                $categoryids[$stringid] = $category->id;
            }
        }
        EventCategory::where('calendar_id', $this->calendarId)->whereNotIn('id', $categoryids)->delete();

        return $categoryids;
    }
}
