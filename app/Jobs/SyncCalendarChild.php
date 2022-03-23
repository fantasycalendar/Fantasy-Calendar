<?php

namespace App\Jobs;

use App\Models\Calendar;
use App\Services\EpochService\EpochCalculator;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncCalendarChild implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private Calendar $parent;
    private Calendar $child;
    private int $targetEpoch;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Calendar $parent, Calendar $child, int $targetEpoch)
    {
        $this->parent = $parent;
        $this->child = $child;
        $this->targetEpoch = $targetEpoch - $child->parent_offset;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $hour = 0;
        $minute = 0;

        if($this->needsTimeCompensation()) {

            $hour = $this->parent->dynamic_data['hour'];
            $minute = $this->parent->dynamic_data['minute'];

            $dayScalingRatio = $this->parent->daily_minutes / $this->child->daily_minutes;

            // First, calculate the current date/time of the child based on the epoch of the parent
            // Taking into account difference in day scaling ratio
            $this->targetEpoch = $this->targetEpoch * $dayScalingRatio;

            $hoursIntoTargetDay = fmod($this->targetEpoch, 1) * $this->child->clock['hours'];
            $minutesIntoTargetHour = (int) round(fmod($hoursIntoTargetDay, 1) * $this->child->clock['minutes']);

            $parentMinuteInDay = $hour * $this->parent->clock['minutes'] + $minute;

            $targetHour = $parentMinuteInDay / $this->child->clock['minutes'];
            $targetMinute = (int) round(fmod($targetHour, 1) * $this->child->clock['minutes']);

            // Take into account time, irrespective of epoch
            $hour = (int) floor($hoursIntoTargetDay) + floor($targetHour);
            $minute = $minutesIntoTargetHour + $targetMinute;


            if($minute >= $this->child->clock['minutes']){
                $hour++;
                $minute -= $this->child->clock['minutes'];
            }

            if($hour >= $this->child->clock['hours']){
                $this->targetEpoch++;
                $hour -= $this->child->clock['hours'];
            }
        }

        $epoch = EpochCalculator::forCalendar($this->child)->calculate($this->targetEpoch);

        $this->child->setDate($epoch->year, $epoch->monthId, $epoch->day, $hour, $minute)->save();
    }

    private function needsTimeCompensation(): bool
    {
        return $this->parent->clock_enabled
            && $this->child->clock_enabled
            && $this->parent->clock->only(['hours', 'minutes']) !== $this->child->clock->only(['hours', 'minutes']);
    }
}
