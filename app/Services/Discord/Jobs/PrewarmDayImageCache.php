<?php

namespace App\Services\Discord\Jobs;

use App\Calendar;
use App\Services\RendererService\ImageRenderer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class PrewarmDayImageCache implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private Calendar $calendar;
    private string $direction;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Calendar $calendar, string $direction)
    {
        $this->calendar = $calendar;
        $this->direction = ($direction == 'add') ? 1 : -1;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $calendar = $this->calendar->addDays($this->direction);

        logger('Prewarming ' . $calendar->name . ' on date ' . $calendar->epoch->slug);

        ImageRenderer::renderMonth($calendar, collect([
            'theme' => 'discord',
            'size' => 'md',
            'year' => $calendar->year,
            'month_id' => $calendar->month_id,
            'day' => $calendar->day
        ]));
    }
}
