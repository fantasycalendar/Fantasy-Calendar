<?php

namespace App\Sharp;

use App\Calendar;
use App\CalendarEvent;
use App\CalendarInvite;
use App\User;

use Carbon\CarbonPeriod;
use Code16\Sharp\Dashboard\Layout\DashboardLayout;
use Code16\Sharp\Dashboard\Layout\DashboardLayoutRow;
use Code16\Sharp\Dashboard\Widgets\SharpBarGraphWidget;
use Code16\Sharp\Dashboard\Widgets\SharpPieGraphWidget;
use Code16\Sharp\Dashboard\Widgets\WidgetsContainer;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Subscription;

use Code16\Sharp\Dashboard\DashboardQueryParams;
use Code16\Sharp\Dashboard\SharpDashboard;
use Code16\Sharp\Dashboard\Widgets\SharpPanelWidget;
use Code16\Sharp\Dashboard\Widgets\SharpLineGraphWidget;
use Code16\Sharp\Dashboard\Widgets\SharpGraphWidgetDataSet;
use Carbon\Carbon;

class StatisticsDashboard extends SharpDashboard
{
    /**
     * Build dashboard's widget using ->addWidget.
     */
    protected function buildWidgets(WidgetsContainer $widgetsContainer): void
    {
        $widgetsContainer->addWidget(
            SharpPanelWidget::make("calendars_created_total")
                ->setInlineTemplate("<h1>{{count}}</h1> calendars")

        )->addWidget(
            SharpPanelWidget::make("calendars_created_in_last_thirty_days")
                ->setInlineTemplate("<h1>{{count}}</h1> calendars created<br><small>in the last 30 days</small>")

        )->addWidget(
            SharpPanelWidget::make("events_created_in_last_thirty_days")
                ->setInlineTemplate("<h1>{{count}}</h1> events created<br><small>in the last 30 days</small>")

        )->addWidget(
            SharpPanelWidget::make("events_created_total")
                ->setInlineTemplate("<h1>{{count}}</h1> events")

        )->addWidget(
            SharpPanelWidget::make("users_created_total")
                ->setInlineTemplate("<h1>{{count}}</h1> users")

        )->addWidget(
            SharpPanelWidget::make("total_subscriptions")
                ->setInlineTemplate("<h1>{{count}}</h1> total subscriptions")

        )->addWidget(
            SharpPanelWidget::make("user_percentage_subscribers")
                ->setInlineTemplate("<h1>{{count}}%</h1> users are subscribed")

        )->addWidget(
            SharpPanelWidget::make("monthly_income_projection")
                ->setInlineTemplate("<h1>\${{count}}</h1> monthly income projection")

        )->addWidget(
            SharpPanelWidget::make("yearly_income_projection")
                ->setInlineTemplate("<h1>\${{count}}</h1> yearly income projection")

        )->addWidget(
            SharpPanelWidget::make("users_created_in_last_thirty_days")
                ->setInlineTemplate("<h1>{{count}}</h1> new users<br><small>in the last 30 days</small>")

        )->addWidget(
            SharpPanelWidget::make("users_active_in_last_thirty_days")
                ->setInlineTemplate("<h1>{{count}}</h1> users active<br><small>in the last 30 days</small>")

        )->addWidget(
            SharpPanelWidget::make("users_active_in_year_to_date")
                ->setInlineTemplate("<h1>{{count}}</h1> users active<br><small>in year to date</small>")

        )->addWidget(
            SharpLineGraphWidget::make("subs_over_time")
                ->setTitle("Subscriptions over time")

        )->addWidget(
            SharpBarGraphWidget::make("subs_per_month")
                ->setTitle("Subscriptions per type each month")

        )->addWidget(
            SharpPieGraphWidget::make("subs_of_type")
                ->setTitle("Subscription ratio")

        )->addWidget(
            SharpLineGraphWidget::make("usergrowth_month")
                ->setTitle("User growth per month")

        )->addWidget(
            SharpLineGraphWidget::make("users_over_time")
                ->setTitle("Total users over time")

        )->addWidget(
            SharpLineGraphWidget::make("agreement_over_time")
                ->setTitle("2.0 Users Over Time")

        );
    }

    /**
     * Build dashboard's widgets layout.
     */
    protected function buildDashboardLayout(DashboardLayout $dashboardLayout): void
    {
        $dashboardLayout->addRow(function(DashboardLayoutRow $row) {
                $row->addWidget(3, "users_created_total")
                    ->addWidget(3, "users_created_in_last_thirty_days")
                    ->addWidget(3, "total_subscriptions")
                    ->addWidget(3, "user_percentage_subscribers");
            })
            ->addRow(function(DashboardLayoutRow $row) {
                $row->addWidget(3, "users_active_in_last_thirty_days")
                    ->addWidget(3, "users_active_in_year_to_date")
                    ->addWidget(3, "monthly_income_projection")
                    ->addWidget(3, "yearly_income_projection");
            })
            ->addRow(function(DashboardLayoutRow $row) {
                $row->addWidget(3, "calendars_created_total")
                    ->addWidget(3, "calendars_created_in_last_thirty_days")
                    ->addWidget(3, "events_created_total")
                    ->addWidget(3, "events_created_in_last_thirty_days");
            })
            ->addFullWidthWidget("subs_over_time")
            ->addRow(function(DashboardLayoutRow $row) {
                $row->addWidget(6, "subs_per_month")
                    ->addWidget(6, "subs_of_type");
            })
            ->addFullWidthWidget("usergrowth_month")
            ->addFullWidthWidget("users_over_time")
            ->addFullWidthWidget("agreement_over_time");
    }

    /**
     * Build dashboard's widgets data, using ->addGraphDataSet and ->setPanelData
     *
     * @param DashboardQueryParams $params
     */
    protected function buildWidgetsData(): void
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
                    WHEN (subscriptions.stripe_plan = "timekeeper_yearly" and users.created_at < "2020-11-08") THEN 1.66
                    WHEN (subscriptions.stripe_plan = "timekeeper_yearly" and users.created_at >= "2020-11-08") THEN 2.04
                    WHEN (subscriptions.stripe_plan = "timekeeper_monthly" and users.created_at < "2020-11-08") THEN 1.99
                    WHEN (subscriptions.stripe_plan = "timekeeper_monthly" and users.created_at >= "2020-11-08") THEN 2.49
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

        /* Total subscriptions per day */
        $monthly_subscriptions = Subscription::where('stripe_plan', '=', 'timekeeper_monthly')
            ->where('created_at', '<', now()->subMonth()->lastOfMonth())
            ->where("stripe_status", "=", "active");

        $yearly_subscriptions = Subscription::where('stripe_plan', '=', 'timekeeper_yearly')
            ->where('created_at', '<', now()->subMonth()->lastOfMonth())
            ->where("stripe_status", "=", "active");

        $monthly = $monthly_subscriptions
            ->selectRaw("DATE_FORMAT(created_at,'%Y-%m') as date, count(*) as count")
            ->orderBy('created_at')
            ->groupByRaw("DATE_FORMAT(created_at,'%Y-%m')")
            ->get()->mapWithKeys(function($result){
                return [$result->date => $result->count];
            });

        $yearly = $yearly_subscriptions
            ->selectRaw("DATE_FORMAT(created_at,'%Y-%m') as date, count(*) as count")
            ->orderBy('created_at')
            ->groupByRaw("DATE_FORMAT(created_at,'%Y-%m')")
            ->get()->mapWithKeys(function($result){
                return [$result->date => $result->count];
            });

        $period = CarbonPeriod::create(
            min($monthly->keys()->first(), $yearly->keys()->first()),
            '1 month',
            max($monthly->keys()->last(), $yearly->keys()->last())
        );

        $monthly_subscriptions_over_time = [];
        $monthly_subscriptions_per_month = [];
        $yearly_subscriptions_over_time = [];
        $yearly_subscriptions_per_month = [];
        $totalMonthlyCount = 0;
        $totalYearlyCount = 0;

        foreach ($period as $date) {
            $dateString = $date->format('Y-m');

            $monthly_subscriptions_per_month[$dateString] = $monthly[$dateString] ?? 0;
            $yearly_subscriptions_per_month[$dateString] = $yearly[$dateString] ?? 0;

            $monthly_subscriptions_over_time[$dateString] = $monthly_subscriptions_per_month[$dateString] + $totalMonthlyCount;
            $yearly_subscriptions_over_time[$dateString] = $yearly_subscriptions_per_month[$dateString] + $totalYearlyCount;

            $totalMonthlyCount += $monthly[$dateString] ?? 0;
            $totalYearlyCount += $yearly[$dateString] ?? 0;
        }

        $this->setPanelData(
            "users_created_total", ["count" => $users_created_total]
        );

        $this->setPanelData(
            "users_created_in_last_thirty_days", ["count" => $users_created_in_last_thirty_days]
        );

        $this->setPanelData(
            "total_subscriptions", ["count" => $total_subscriptions]
        );

        $this->setPanelData(
            "user_percentage_subscribers", ["count" => $user_percentage_subscribers]
        );

        $this->setPanelData(
            "monthly_income_projection", ["count" => round($monthly_income_projection)]
        );

        $this->setPanelData(
            "yearly_income_projection", ["count" => round($monthly_income_projection)*12]
        );

        $this->setPanelData(
            "users_active_in_last_thirty_days", ["count" => $users_active_in_last_thirty_days]
        );

        $this->setPanelData(
            "users_active_in_year_to_date", ["count" => $users_active_in_year_to_date]
        );

        $this->setPanelData(
            "calendars_created_in_last_thirty_days", ["count" => $calendars_created_in_last_thirty_days]
        );

        $this->setPanelData(
            "calendars_created_total", ["count" => $calendars_created_total]
        );

        $this->setPanelData(
            "events_created_total", ["count" => $events_created_total]
        );

        $this->setPanelData(
            "events_created_in_last_thirty_days", ["count" => $events_created_in_last_thirty_days]
        );

        $this->addGraphDataSet(
            "subs_over_time",
            SharpGraphWidgetDataSet::make($yearly_subscriptions_over_time)
                ->setLabel("Yearly")
                ->setColor("red")
        );

        $this->addGraphDataSet(
            "subs_over_time",
            SharpGraphWidgetDataSet::make($monthly_subscriptions_over_time)
                ->setLabel("Monthly")
                ->setColor("blue")
        );

        $this->addGraphDataSet(
            "subs_per_month",
            SharpGraphWidgetDataSet::make($monthly_subscriptions_per_month)
                ->setLabel("Monthly")
                ->setColor("blue")
        );

        $this->addGraphDataSet(
            "subs_per_month",
            SharpGraphWidgetDataSet::make($yearly_subscriptions_per_month)
                ->setLabel("Yearly")
                ->setColor("red")
        );

        $this->addGraphDataSet(
            "subs_of_type",
            SharpGraphWidgetDataSet::make([$totalYearlyCount])
                ->setLabel("Yearly")
                ->setColor("red")
        );

        $this->addGraphDataSet(
            "subs_of_type",
            SharpGraphWidgetDataSet::make([$totalMonthlyCount])
                ->setLabel("Monthly")
                ->setColor("blue")
        );

        $this->addGraphDataSet(
            "usergrowth_month",
            SharpGraphWidgetDataSet::make($user_count_per_month)
                ->setLabel("Users")
                ->setColor("blue")
        );

        $this->addGraphDataSet(
            "users_over_time",
            SharpGraphWidgetDataSet::make($user_count_over_time)
                ->setLabel("Users")
                ->setColor("blue")
        );

        $this->addGraphDataSet(
            "agreement_over_time",
            SharpGraphWidgetDataSet::make($user_agreement_over_time)
                ->setLabel("Users")
                ->setColor("blue")
        );
    }
}
