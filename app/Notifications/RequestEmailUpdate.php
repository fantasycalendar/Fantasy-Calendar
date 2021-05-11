<?php

namespace App\Notifications;

use App\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use URL;

class RequestEmailUpdate extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(User $user, $new_email)
    {
        $this->user = $user;
        $this->new_email = $new_email;
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
                    ->subject("Email Change Request")
                    ->greeting(sprintf('Hello %s,', $this->user->username))
                    ->line(sprintf("You have requested to change your email on your Fantasy-Calendar account to \"%s\". Click the button below to confirm the request.", $this->new_email))
                    ->action('Confirm Email Change', URL::temporarySignedRoute('update.email', now()->addHour(1), ['user' => $this->user, 'old_email' => $this->user->email, 'new_email' => $this->new_email]))
                    ->line('If you did not make this request, please ignore this email and get in contact with us immediately at contact@fantasy-calendar.com');
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
