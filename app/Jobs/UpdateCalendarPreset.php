<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use App\Preset;
use App\Calendar;

use App\Jobs\ConvertCalendarToPreset;

class UpdateCalendarPreset implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($preset)
    {
        $this->preset = $preset;
        $this->calendar = Calendar::find($this->preset->source_calendar_id);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->preset->delete();
        return ConvertCalendarToPreset::dispatchNow($this->calendar);
    }
}
