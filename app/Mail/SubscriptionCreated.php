<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Stripe\Subscription;

class SubscriptionCreated extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @var User
     */
    private $user;
    private $price;
    private $interval;

    /**
     * Create a new message instance.
     *
     * @param User $user
     * @param $price
     * @param $interval
     */
    public function __construct(User $user, $price, $interval)
    {
        $this->user = $user;
        $this->price = $price;
        $this->interval = $interval;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.subscription.created',[
            'user' => $this->user,
            'price' => number_format($this->price/100, 2, '.', ','),
            'interval' => $this->interval
        ]);
    }
}
