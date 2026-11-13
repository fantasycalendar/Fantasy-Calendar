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

            $childDailyMinutes = $this->child->daily_minutes;
            $childMinutesPerHour = (int) $this->child->clock['minutes'];

            // Days on both calendars are measured in minutes of equal length, so the parent's
            // elapsed days convert to a fractional number of child days.
            $dayScalingRatio = $this->parent->daily_minutes / $childDailyMinutes;
            $scaledEpoch = $this->targetEpoch * $dayScalingRatio;
            $wholeDays = floor($scaledEpoch);

            $minutesIntoChildDay = (int) round(($scaledEpoch - $wholeDays) * $childDailyMinutes);

            $parentMinuteInDay = $this->parent->dynamic_data['hour'] * $this->parent->clock['minutes'] + $this->parent->dynamic_data['minute'];

            $totalMinutes = $minutesIntoChildDay + $parentMinuteInDay;

            $this->targetEpoch = (int) $wholeDays + intdiv($totalMinutes, $childDailyMinutes);

            $minutesIntoDay = $totalMinutes % $childDailyMinutes;
            $hour = intdiv($minutesIntoDay, $childMinutesPerHour);
            $minute = $minutesIntoDay % $childMinutesPerHour;
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
