<?php

namespace App\Notifications;

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
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct()
    {
        $total_users = User::count();
        $users_today = User::where('email_verified_at', '>', Carbon::today())->count();

        if($users_today != 0){
            $this->users_string = "$total_users (+$users_today)";
        }else{
            $this->users_string = "$total_users (No change)";
        }
    
        $prev_subscriptions = DB::table('webhooks_out')->first();

        $active_subscriptions = DB::table('subscriptions')->where("stripe_status", "=", "active");

        // Active monthly subscriptions
        $active_monthly_subscriptions = $active_subscriptions->where("stripe_plan", "=", "timekeeper_monthly");
        $total_monthly_subscriptions = $active_subscriptions->count();

        $new_monthly_subscriptions = $total_monthly_subscriptions - 0; //$prev_subscriptions->total_monthly_subscriptions;

        if($new_monthly_subscriptions != 0){
            $sign = ( $new_monthly_subscriptions > 0 ) ? "+" : "-";
            $this->monthly_string = "$total_monthly_subscriptions ($sign$new_monthly_subscriptions)";
        }else{
            $this->monthly_string = "$total_monthly_subscriptions (No change)";
        }

        // Active yearly subscriptions
        $active_yearly_subscriptions = $active_subscriptions->where("stripe_plan", "=", "timekeeper_yearly");
        $total_yearly_subscriptions = $active_subscriptions->count();

        $new_yearly_subscriptions = $total_yearly_subscriptions - 0; //$prev_subscriptions->total_yearly_subscriptions;

        if($new_yearly_subscriptions != 0){
            $sign = ( $new_yearly_subscriptions > 0 ) ? "+" : "-";
            $this->yearly_string = "$total_yearly_subscriptions ($sign$new_yearly_subscriptions)";
        }else{
            $this->yearly_string = "$total_yearly_subscriptions (No change)";
        }

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
                    ->field('Total Users', $this->users_string, true)
                    ->field('Monthly Subscribers', $this->monthly_string, true)
                    ->field('Yearly Subscribers', $this->yearly_string, true)
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
