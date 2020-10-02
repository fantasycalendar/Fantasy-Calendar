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

    public function getMonthlySubscribersToday() {
        $monthly_subscriptions = $this->subscription->query()->where('stripe_plan', '=', 'timekeeper_monthly')->active();
        $total_monthly_subscriptions = $monthly_subscriptions->count();
        $monthly_subscriptions_today = $monthly_subscriptions->where('updated_at', '>', today())->count();

        return sprintf("%s (%s)", $total_monthly_subscriptions, (($monthly_subscriptions_today) ? $monthly_subscriptions_today: "No change"));
    }

    public function getYearlySubscribersToday() {
        $yearly_subscriptions = $this->subscription->query()->where('stripe_plan', '=', 'timekeeper_yearly')->active();
        $total_yearly_subscriptions = $yearly_subscriptions->count();
        $yearly_subscriptions_today = $yearly_subscriptions->where('updated_at', '>', today())->count();

        return sprintf("%s (%s)", $total_yearly_subscriptions, (($yearly_subscriptions_today) ? $yearly_subscriptions_today: "No change"));
    }
}
