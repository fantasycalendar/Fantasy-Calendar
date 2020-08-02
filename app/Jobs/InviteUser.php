<?php

namespace App\Jobs;

use App\Calendar;
use App\Notifications\CalendarInvitation;
use App\Notifications\UnregisteredCalendarInvitation;
use App\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Notification;

class InviteUser implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // The email we want to invite
    private $email;

    // The calendar they're being invited to
    private $calendar;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Calendar $calendar, $email)
    {
        $this->calendar = $calendar;
        $this->email = $email;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
//        try {
            $user = User::whereEmail($this->email)->first();

            $user->notify(new CalendarInvitation($this->calendar));
//        } catch (\Throwable $e) {
//            // Fail without telling anyone but the logs, no reason we should ever tell someone whether a user exists with a given email
//            Notification::route('mail', $this->email)
//                ->notify(new UnregisteredCalendarInvitation($this->calendar));
//        }

    }
}
