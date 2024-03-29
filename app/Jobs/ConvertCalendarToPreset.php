<?php

namespace App\Jobs;

use Illuminate\Support\Str;

use App\Models\Calendar;
use App\Models\Preset;
use App\Models\PresetEvent;
use App\Models\PresetEventCategory;

class ConvertCalendarToPreset
{
    /**
     * Create a new job instance.
     *
     * @param Calendar $calendar
     * @param string $description
     */
    public function __construct(public Calendar $calendar, public $description = "")
    {
    }

    public static function dispatchSync(Calendar $calendar, $description = "")
    {
        return (new static($calendar, $description))->handle();
    }

    /**
     * Execute the job.
     *
     * @param Preset $preset
     * @param PresetEvent $preset_event
     * @param PresetEventCategory $preset_event_category
     * @return void
     */
    public function handle()
    {
        $new_preset = Preset::create([
            'name' => $this->calendar->name,
            'static_data' => $this->calendar->static_data,
            'dynamic_data' => $this->calendar->dynamic_data,
            'description' => $this->description,
            'source_calendar_id' => $this->calendar->id,
            'creator_id' => $this->calendar->user->id
        ]);

        foreach ($this->calendar->event_categories as $category) {
            PresetEventCategory::create([
                'name' => $category->name,
                'event_settings' => $category->event_settings,
                'category_settings' => $category->category_settings,
                'label' => Str::slug($category->name),
                'preset_id' => $new_preset->id
            ]);
        }

        foreach ($this->calendar->events as $event) {
            PresetEvent::create([
                'name' => $event->name,
                'data' => $event->data,
                'description' => $event->description,
                'preset_event_category_id' => $event->event_category_id ?? -1,
                'event_category_id' => ($event->category()->exists()) ? Str::slug($event->category->name) : "-1",
                'preset_id' => $new_preset->id,
                'settings' => $event->settings
            ]);
        }

        return $new_preset;
    }
}
