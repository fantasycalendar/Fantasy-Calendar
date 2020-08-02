<?php

namespace App\Notifications;

use App\Calendar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UnregisteredCalendarInvitation extends Notification
{
    use Queueable;

    private $calendar;

    /**
     * Create a new notification instance.
     *
     * @param Calendar $calendar
     */
    public function __construct(Calendar $calendar)
    {
        $this->calendar = $calendar;
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
                    ->greeting("You're invited to collaborate on Fantasy Calendar!")
                    ->line(sprintf("A user called %s has invited you as a player on their calendar '%s'! Accept below to check it out.", $this->calendar->user->name, $this->calendar->name))
                    ->action('Register for an Account', route('invite.register', ['calendar' => $this->calendar]))
                    ->line("Once you're signed up, you'll be given access.");
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
