<?php

namespace App\Jobs;

use App\Calendar;
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
        $hour = $this->parent->dynamic_data['hour'];
        $minute = $this->parent->dynamic_data['minute'];
        $second = $this->parent->dynamic_data['second'];

        if($this->needsTimeCompensation()) {

            $dayScalingRatio = $this->parent->daily_seconds / $this->child->daily_seconds;

            // First, calculate the current date/time of the child based on the epoch of the parent
            // Taking into account difference in day scaling ratio
            $this->targetEpoch = $this->targetEpoch * $dayScalingRatio;

            $hoursIntoTargetDay = fmod($this->targetEpoch, 1) * $this->child->clock['hours'];
            $minutesIntoTargetHour = fmod($hoursIntoTargetDay, 1) * $this->child->clock['minutes'];
            $secondsIntoTargetMinute = fmod($minutesIntoTargetHour, 1) * $this->child->clock['seconds'];

            $parentSecondInDay = ($hour * $this->parent->clock['minutes'] + $minute) * $this->parent->clock['seconds'] + $second;

            $targetHour = $parentSecondInDay / $this->child->clock['seconds'] / $this->child->clock['minutes'];
            $targetMinute = fmod($targetHour, 1) * $this->child->clock['minutes'];
            $targetSecond = fmod($targetMinute, 1) * $this->child->clock['second'];

            // Take into account time, irrespective of epoch
            $hour = (int) floor($hoursIntoTargetDay) + floor($targetHour);
            $minute = (int) round($minutesIntoTargetHour) + round($targetMinute);
            $second = (int) round($secondsIntoTargetMinute) + round($targetSecond);

            if($second >= $this->child->clock['seconds']){
                $minute++;
                $second -= $this->child->clock['seconds'];
            }

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

        $this->child->setDate($epoch->year, $epoch->monthId, $epoch->day, $hour, $minute, $second)->save();
    }

    private function needsTimeCompensation(): bool
    {
        return $this->parent->clock_enabled
            && $this->child->clock_enabled
            && $this->parent->clock->only(['hours', 'minutes', 'seconds']) !== $this->child->clock->only(['hours', 'minutes', 'seconds']);
    }
}
