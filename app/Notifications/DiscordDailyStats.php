<?php

namespace App\Notifications;

use App\Services\Statistics;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Awssat\Notifications\Messages\DiscordMessage;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use App\User;
use Carbon\Carbon;

class DiscordDailyStats extends Notification
{
    use Queueable;

    /**
     * @string total_users
     */
    private $total_users;

    /**
     * @string monthly_subscribers
     */
    private $monthly_subscribers;

    /**
     * @string yearly_subscribers
     */
    private $yearly_subscribers;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct()
    {
        $statistics = new Statistics();

        // Users verified today
        $this->total_users = $statistics->getUsersVerifiedToday();
        dd($this->total_users);

        // Total monthly subscribers
        // Change to monthly subscribers since last time
        // Total yearly subscribers
        // Change to yearly subscribers since last time
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
        $notification = (new DiscordMessage)
            ->from('Fantasy-Calendar-Stats')
            ->embed(function ($embed) {
                $embed->title('Daily Statistics')
                    ->field('Total Users', $this->total_users, true)
                    ->field('Monthly Subscribers', $this->monthly_subscribers, true)
                    ->field('Yearly Subscribers', $this->yearly_subscribers, true)
                    ->color("75e242");
            });

        return $notification;
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
