<?php

namespace App\Jobs;

use App\Models\Calendar;
use App\Models\EventCategory;

class SaveEventCategories
{
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        public array $categories,
        public int $calendarId,
    ) {
    }

    public static function dispatchSync(array $categories = [], int $calendarId)
    {
        return (new static($categories, $calendarId))->handle();
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $calendar = Calendar::find($this->calendarId);
        $existingCategories = $calendar->event_categories()
            ->pluck('id', 'id');

        // The end result of this is an array of category IDs
        // - The key is the category ID from the request, which can either be:
        //     - A string, which means it's a new category
        //     - A number, which means it's an existing category
        //
        //  The value is the category ID in the database, whether we created or updated
        $categoryIds = collect($this->categories)
            ->sortBy('sort_by')
            ->mapWithKeys(function ($event, $sortBy) use ($calendar, $existingCategories) {
                $event['sort_by'] = $sortBy;

                // This category has an ID, so we just need to update it
                if (array_key_exists('id', $event) && $existingCategories->has($event['id'])) {
                    $calendar->event_categories()
                        ->where('id', $event['id'])
                        ->update($event);

                    return [$event['id'] => $event['id']];
                }

                // Otherwise, we need to create a new category
                $stringid = $event['id'];

                $event = $calendar->event_categories()
                    ->create($event);

                return [$stringid => $event->id];
            });

        $calendar->event_categories()
            ->whereNotIn('id', $categoryIds)
            ->delete();

        return $categoryIds;
    }
}
