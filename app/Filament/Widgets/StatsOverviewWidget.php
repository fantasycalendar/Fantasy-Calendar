<?php

namespace App\Filament\Widgets;

use App\Models\Calendar;
use App\Models\CalendarEvent;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Card;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;
use Laravel\Cashier\Subscription;

class StatsOverviewWidget extends BaseWidget
{
//    protected static string $view = 'filament.widgets.stats-overview-widget';

    protected int | string | array $columnSpan = 2;

    protected function getCards(): array
    {
        $values = cache()->remember('stats_overview_widget_data', 300, function() {
            return self::generateStats();
        });

        extract($values);

        return [
            Stat::make('Users', User::verified()->count())
                ->description(User::verified()->where('created_at', '>', now()->subDays(30))->count() . ' - 30-day increase')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart($user_count_over_time)
                ->color('success'),
            Stat::make('Calendars', $calendars_created_total)
                ->description($calendars_created_in_last_thirty_days . ' - 30-day increase')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart([$calendars_created_total - $calendars_created_in_last_thirty_days, $calendars_created_total])
                ->color('success'),
            Stat::make('Events', $events_created_total)
                ->description($events_created_in_last_thirty_days . ' - 30-day increase')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart([$events_created_total - $events_created_in_last_thirty_days, $events_created_total])
                ->color('success'),
            Stat::make('Active Users - Last 30 days', $users_active_in_last_thirty_days)
                ->description($users_active_in_year_to_date . " active year to date")
                ->color('success'),
            Stat::make('Subscriptions', $total_subscriptions)
                ->description($user_percentage_subscribers . "% of all users")
                ->color('success'),
            Stat::make('Projected Yearly Income', "$" . round($monthly_income_projection)*12)
                ->description("\${$monthly_income_projection} monthly projected x12")
                ->color('success'),
        ];
    }

    private static function generateStats()
    {
        $last30Days = now()->subDays(30);

        $userQuery = User::query();

        $users_created_total = $userQuery->verified()->count();

        $users_created_in_last_thirty_days = $userQuery
            ->where('email_verified_at', '>', $last30Days)
            ->count();

        $users_active_in_last_thirty_days = $userQuery
            ->where('last_visit', '>', $last30Days)
            ->count();

        $users_active_in_year_to_date = $userQuery
            ->where('last_visit', '>', now()->startOfYear())
            ->count();


        $monthly_income_projection = DB::table("users")
            ->rightJoin('subscriptions', "users.id", '=', 'subscriptions.user_id')
            ->whereNull('users.deleted_at')
            ->whereNotNull('users.email_verified_at')
            ->where("subscriptions.stripe_status", "=", "active")
            ->selectRaw(
                'CASE
                    WHEN (subscriptions.stripe_price = "timekeeper_yearly" and users.created_at < "2020-11-08") THEN 1.66
                    WHEN (subscriptions.stripe_price = "timekeeper_yearly" and users.created_at >= "2020-11-08") THEN 2.04
                    WHEN (subscriptions.stripe_price = "timekeeper_monthly" and users.created_at < "2020-11-08") THEN 1.99
                    WHEN (subscriptions.stripe_price = "timekeeper_monthly" and users.created_at >= "2020-11-08") THEN 2.49
                END as value
            ')->get()->sum('value');

        $total_subscriptions = Subscription::where("stripe_status", "=", "active")->count();

        $user_percentage_subscribers = round(($total_subscriptions / $users_created_total)*100, 2);

        $validCalendars = Calendar::query();

        $calendars_created_total = $validCalendars->count();

        $calendars_created_in_last_thirty_days = $validCalendars
            ->where('date_created', '>', $last30Days)
            ->count();

        $events_created_total = CalendarEvent::count();

        $events_created_in_last_thirty_days = CalendarEvent::where('created_at', '>', $last30Days)->count();

        /* User growth and total users */
        $userQuery = User::where('created_at', '<', now()->subMonth()->lastOfMonth());

        $total_users = 0;
        $user_count_per_month = $userQuery
            ->selectRaw("DATE_FORMAT(created_at,'%Y-%m') as date, count(*) as count")
            ->orderBy('created_at')
            ->groupByRaw("DATE_FORMAT(created_at,'%Y-%m')")
            ->get()
            ->mapWithKeys(function($result){
                return [$result->date => $result->count];
            });

        $user_count_over_time = [];
        foreach ($user_count_per_month as $date => $result) {
            $user_count_over_time[$date] = $result + $total_users;
            $total_users += $result;
        }

        /* Total users converted to 2.0 per day */

//        $total_users_converted = $userQuery->where('agreed_at', '<', now()->subMonth()->lastOfMonth())->count();
        $users_converted_per_month = $userQuery
            ->where('agreed_at', '<', now()->subMonth()->lastOfMonth())
            ->selectRaw("DATE_FORMAT(agreed_at,'%Y-%m') as date, count(*) as count")
            ->orderBy('agreed_at')
            ->groupByRaw("DATE_FORMAT(agreed_at,'%Y-%m')")
            ->get()
            ->mapWithKeys(function($result){
                return [$result->date => $result->count];
            });

        $total_users_converted = 0;
        $user_agreement_over_time = [];
        foreach ($users_converted_per_month as $date => $number_of_users) {
            $user_agreement_over_time[$date] = $number_of_users + $total_users_converted;
            $total_users_converted += $number_of_users;
        }

        return [
            'user_count_over_time' => $user_count_over_time,
            'calendars_created_total' => $calendars_created_total,
            'calendars_created_in_last_thirty_days' => $calendars_created_in_last_thirty_days,
            'events_created_in_last_thirty_days' => $events_created_in_last_thirty_days,
            'events_created_total' => $events_created_total,
            'users_active_in_last_thirty_days' => $users_active_in_last_thirty_days,
            'users_active_in_year_to_date' => $users_active_in_year_to_date,
            'total_subscriptions' => $total_subscriptions,
            'user_percentage_subscribers' => $user_percentage_subscribers,
            'monthly_income_projection' => $monthly_income_projection,
       ];
    }

    private function subscriptionsCard()
    {
        $subscriptions = Subscription::where('stripe_status', '=', 'active');
        $newSubscriptions = Subscription::where('stripe_status', '=', 'active')
            ->whereNotIn('user_id', $subscriptions->where('created_at', '<', now()->subDays(30))->pluck('user_id'))
            ->where('created_at', '>', now()->subDays(30))
            ->count();

        $changeDirection = $newSubscriptions > 0
            ? ' increase'
            : ' decrease';
        $iconDirection = $newSubscriptions > 0
            ? 'up'
            : 'down';
        $iconColor = $newSubscriptions > 0
            ? 'success'
            : 'warning';

        return Stat::make('Active Subscriptions', $subscriptions->count())
            ->description($newSubscriptions . " - 30 day $changeDirection")
            ->descriptionIcon("heroicon-s-trending-$iconDirection")
            ->color($iconColor);
    }
}
