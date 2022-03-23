<?php

namespace App\Notifications;

use App\Models\Calendar;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use URL;

class UnregisteredCalendarInvitation extends Notification
{
    use Queueable;

    private $invitation;

    /**
     * Create a new notification instance.
     *
     * @param Calendar $calendar
     */
    public function __construct($invitation)
    {
        $this->invitation = $invitation;
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
                    ->subject(sprintf("Fantasy Calendar Invite From %s", $this->invitation->calendar->user->username))
                    ->greeting("You're invited to collaborate via Fantasy Calendar!")
                    ->line(sprintf("A user called %s has invited you as a player on their calendar '%s'!", $this->invitation->calendar->user->username, $this->invitation->calendar->name))
                    ->line("Get registered below to check it out.")
                    ->action('Register for an Account', env('APP_URL') . URL::signedRoute('invite.register', ['calendar' => $this->invitation->calendar->hash, 'email' => $this->invitation->email, 'token' => $this->invitation->invite_token], now()->addWeek(), false))
                    ->line(sprintf("Once you've gotten signed up, %s will be able to give you more access.", $this->invitation->calendar->user->username));
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
