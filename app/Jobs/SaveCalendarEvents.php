<?php

namespace App\Jobs;

use App\Models\Calendar;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Mews\Purifier\Facades\Purifier;

use App\Models\CalendarEvent;
use Illuminate\Support\Collection;

class SaveCalendarEvents
{
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        public array $events,
        public Collection $categoryIds,
        public int $calendarId,
    ) {
    }

    public static function dispatchSync(array $events, Collection $categoryIds, int $calendarId)
    {
        return (new static($events, $categoryIds, $calendarId))->handle();
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $calendar = Calendar::find($this->calendarId);

        $eventIds = collect($this->events)
            ->sortBy('sort_by')
            ->map(function (array $event, $sortBy) use ($calendar) {
                $event['event_category_id'] = $this->resolveCategoryId(Arr::get($event, 'event_category_id'));
                $event['sort_by'] = $sortBy;

                if (array_key_exists('id', $event)) {
                    $calendar->events()
                        ->where('id', $event['id'])
                        ->update($event);

                    return $event['id'];
                }

                $event['creator_id'] = Auth::user()->id ?? auth()->user()->id ?? $calendar->user->id;
                $event['calendar_id'] = $this->calendarId;

                $event = $calendar->events()->create($event);
                return $event->id;
            });

        CalendarEvent::where('calendar_id', $this->calendarId)
            ->whereNotIn('id', $eventIds)
            ->delete();

        return $eventIds;
    }

    private function resolveCategoryId($value)
    {
        if (empty($value) || $value === "-1" || $value < 0) {
            return null;
        }

        if (!is_numeric($value)) {
            return $this->categoryIds->get($value);
        }

        if ($this->categoryIds->contains($value)) {
            return $value;
        }

        return null;
    }
}
