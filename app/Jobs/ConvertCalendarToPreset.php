<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

use App\Calendar;
use App\Preset;
use App\PresetEvent;
use App\PresetEventCategory;

class ConvertCalendarToPreset implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $calendar;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Calendar $calendar)
    {
        $this->calendar = $calendar;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(Preset $preset, PresetEvent $preset_event, PresetEventCategory $preset_event_category)
    {
        $new_preset = $preset->create([
            'name' => $this->calendar->name,
            'static_data' => $this->calendar->static_data,
            'dynamic_data' => $this->calendar->dynamic_data,
            'description' => $this->calendar->name,
            'source_calendar_id' => $this->calendar->id,
        ]);

        foreach ($this->calendar->event_categories as $category) {
            $preset_event_category->create([
                'name' => $category->name,
                'event_settings' => $category->event_settings,
                'category_settings' => $category->category_settings,
                'label' => Str::slug($category->name),
                'preset_id' => $new_preset->id
            ]);
        }

        foreach ($this->calendar->events as $event) {
            $preset_event->create([
                'name' => $event->name,
                'data' => $event->data,
                'description' => $event->description,
                'preset_event_category_id' => $event->event_category_id,
                'event_category_id' => Str::slug($event->category->name ?? ""),
                'preset_id' => $new_preset->id,
                'settings' => $event->settings
            ]);
        }

        return $new_preset;
    }
}
