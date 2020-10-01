<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Awssat\Notifications\Messages\DiscordMessage;
use Illuminate\Notifications\Notifiable;
use App\User;
use Carbon\Carbon;

class NotificationDiscordChannelTestNotifiable
{
    use Notifiable;

    public function routeNotificationForDiscord()
    {
        return "https://discordapp.com/api/webhooks/760982858747084831/aiW4QmC-CRR0Lbi9EvoR8fjTLzJL6rLEaYNd80K7K7UeNrPR5sUtRwLUfLN5sWpVvUcF";
    }
}

class DiscordDailyStats extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct()
    {
        
        $total_users = User::count();
        $users_today = User::where('email_verified_at', '>', Carbon::today())->count();
        $this->users_string = "$total_users (+$users_today)";
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['discord'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toDiscord($notifiable)
    {

        return (new DiscordMessage)
            ->from('Fantasy-Calendar-Stats')
            ->embed(function ($embed) {
                $embed->title('Daily Statistics')
                    ->field('Total Users', $this->users_string, true)
                    ->field('Monthly Subscribers', '0 (+0)', true)
                    ->field('Yearly Subscribers', '0 (+0)', true)
                    ->color("75e242");
            });
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
