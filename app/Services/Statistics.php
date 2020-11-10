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
        $total_users = $this->user->whereNull('deleted_at')->whereNotNull('created_at')->count();
        $users_today = $this->user->whereNull('deleted_at')->where('created_at', '>', now()->subHours(24))->count();

        return $this->format($total_users, $users_today);
    }

    public function getMonthlySubscribersToday() {
        $monthly_subscriptions = $this->subscription->query()->where('stripe_plan', '=', 'timekeeper_monthly')->active();
        $total_monthly_subscriptions = $monthly_subscriptions->count();
        $monthly_subscriptions_today = $monthly_subscriptions->where('updated_at', '>', now()->subHours(24))->count();

        return $this->format($total_monthly_subscriptions, $monthly_subscriptions_today);
    }

    public function getYearlySubscribersToday() {
        $yearly_subscriptions = $this->subscription->query()->where('stripe_plan', '=', 'timekeeper_yearly')->active();
        $total_yearly_subscriptions = $yearly_subscriptions->count();
        $yearly_subscriptions_today = $yearly_subscriptions->where('updated_at', '>', now()->subHours(24))->count();

        return $this->format($total_yearly_subscriptions, $yearly_subscriptions_today);
    }

    public function format($total, $today) {
        return sprintf("%s (%s)", $total, (($today) ? $today: "No change"));
    }
}
