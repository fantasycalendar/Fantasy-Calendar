<?php

namespace App\Notifications;

use App\Models\Calendar;
use App\Models\CalendarInvite;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use URL;

class CalendarInvitation extends Notification
{
    use Queueable;

    /**
     * @var CalendarInvite
     */
    private $invite;

    /**
     * Create a new notification instance.
     *
     * @param CalendarInvite $invite
     */
    public function __construct(CalendarInvite $invite)
    {
        $this->invite = $invite;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->greeting(sprintf('You\'ve been invited to %s!', $this->invite->calendar->name))
                    ->line(sprintf("A user called %s has invited you as a player on their calendar '%s'! Accept below to check it out.", $this->invite->calendar->user->username, $this->invite->calendar->name))
                    ->action('Accept Invitation', env('APP_URL') . URL::signedRoute('invite.accept', ['calendar' => $this->invite->calendar->hash, 'email' => $this->invite->email, 'token' => $this->invite->invite_token], now()->addWeek(), false))
                    ->line("Once you accept, the calendar's creator will be able to give you additional privileges.");
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
