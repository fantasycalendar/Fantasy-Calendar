<?php

namespace App\Notifications;

use App\Calendar;
use App\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use URL;

class CalendarInvitation extends Notification
{
    use Queueable;

    private $calendar;
    /**
     * @var User
     */
    private $user;

    /**
     * Create a new notification instance.
     *
     * @param Calendar $calendar
     * @param User $user
     */
    public function __construct(Calendar $calendar, User $user)
    {
        $this->calendar = $calendar;
        $this->user = $user;
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
                    ->greeting(sprintf('You\'ve been invited to %s!', $this->calendar->name))
                    ->line(sprintf("A user called %s has invited you as a player on their calendar '%s'! Accept below to check it out.", $this->calendar->user->username, $this->calendar->name))
                    ->action('Accept Invitation', env('APP_URL') . URL::signedRoute('invite.accept', ['calendar' => $this->calendar->hash, 'email' => $this->user->email], now()->addWeek(), false))
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
