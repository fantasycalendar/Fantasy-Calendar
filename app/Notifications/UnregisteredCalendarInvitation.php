<?php

namespace App\Notifications;

use App\Calendar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use URL;

class UnregisteredCalendarInvitation extends Notification
{
    use Queueable;

    private $calendar;

    private $email;

    /**
     * Create a new notification instance.
     *
     * @param Calendar $calendar
     */
    public function __construct(Calendar $calendar, $email)
    {
        $this->calendar = $calendar;

        $this->email = $email;
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
                    ->greeting("You're invited to collaborate via Fantasy Calendar!")
                    ->line(sprintf("A user called %s has invited you as a player on their calendar '%s'!", $this->calendar->user->username, $this->calendar->name))
                    ->line("Get registered below to check it out.")
                    ->action('Register for an Account', env('APP_URL') . URL::signedRoute('invite.register', ['calendar' => $this->calendar, 'email' => $this->email], now()->addWeek(), false))
                    ->line(sprintf("Once you've gotten signed up, %s will be able to give you more access.", $this->calendar->user->username));
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
