<?php


namespace App\Services;


use App\User;
use Laravel\Cashier\Subscription;

class Statistics
{
    /**
     * @var User
     */
    private $user;
    /**
     * @var Subscription
     */
    private $subscription;

    public function __construct(){
        $this->user = new User();
        $this->subscription = new Subscription();
    }

    public function getUsersVerifiedToday() {
        $total_users = $this->user->whereNotNull('email_verified_at')->count();
        $users_today = $this->user->where('email_verified_at', '>', today())->count();

        return sprintf("%s (%s)", $total_users, (($users_today) ? $users_today: "No change"));
    }
}
