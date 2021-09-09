<?php

namespace App\Sharp;

use App\User;

use Carbon\CarbonPeriod;
use Code16\Sharp\Dashboard\Layout\DashboardLayoutRow;
use Code16\Sharp\Dashboard\Widgets\SharpBarGraphWidget;
use Code16\Sharp\Dashboard\Widgets\SharpPieGraphWidget;
use Illuminate\Support\Arr;
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
    protected function buildWidgets()
    {
        $this->addWidget(
            SharpPanelWidget::make("users_active_in_last_thirty_days")
                ->setInlineTemplate("<h1>{{count}}</h1> users active in the last 30 days")

        )->addWidget(
            SharpPanelWidget::make("users_active_in_year_to_date")
                ->setInlineTemplate("<h1>{{count}}</h1> users active in year to date")

        )->addWidget(
            SharpLineGraphWidget::make("subs_over_time")
                ->setTitle("Subscriptions")

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
    protected function buildWidgetsLayout()
    {
        $this->addRow(function(DashboardLayoutRow $row) {
                $row->addWidget(6, "users_active_in_last_thirty_days")
                    ->addWidget(6, "users_active_in_year_to_date");
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
    protected function buildWidgetsData(DashboardQueryParams $params)
    {

        $user_model = new User();

        /* User growth and total users */

        $users = $user_model->whereNull('deleted_at')->where('created_at', '<', now()->subMonth()->lastOfMonth())->get();

        $user_count_per_month = $users
            ->sortBy('created_at')
            ->groupBy(function($user) {
                return Carbon::parse($user->created_at)->format('Y-m');
            })->mapWithKeys(function($users, $date) {
                return [$date => count($users)];
            });

        $total_users = 0;
        $user_count_over_time = [];
        foreach ($user_count_per_month as $date => $number_of_users) {
            $user_count_over_time[$date] = $number_of_users + $total_users;
            $total_users += $number_of_users;
        }

        /* Total users converted to 2.0 per day */

        $users_converted_per_month = $users
            ->where('agreed_at', '<', now()->subMonth()->lastOfMonth())
            ->sortBy('agreed_at')
            ->groupBy(function($user) {
                return Carbon::parse($user->agreed_at)->format('Y-m');
            })->mapWithKeys(function($users, $date) {
                return [$date => count($users)];
            });

        $total_users_converted = 0;
        $user_agreement_over_time = [];
        foreach ($users_converted_per_month as $date => $number_of_users) {
            $user_agreement_over_time[$date] = $number_of_users + $total_users_converted;
            $total_users_converted += $number_of_users;
        }

        /* Total subscriptions per day */
        $monthly_subscriptions = Subscription::where('stripe_plan', '=', 'timekeeper_monthly')->get();
        $yearly_subscriptions = Subscription::where('stripe_plan', '=', 'timekeeper_yearly')->get();

        $monthly = $monthly_subscriptions
            ->where('created_at', '<', now()->subMonth()->lastOfMonth())
            ->where('stripe_status', '=', "active")
            ->groupBy(function($subscription) {
                return Carbon::parse($subscription->created_at)->format('Y-m');
            })->mapWithKeys(function($subscriptions, $date) {
                return [$date => count($subscriptions)];
            });

        $yearly = $yearly_subscriptions
            ->where('created_at', '<', now()->subMonth()->lastOfMonth())
            ->where('stripe_status', '=', "active")
            ->groupBy(function($subscription) {
                return Carbon::parse($subscription->created_at)->format('Y-m');
            })->mapWithKeys(function($subscriptions, $date) {
                return [$date => count($subscriptions)];
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

        $users_active_in_last_thirty_days = $user_model->whereNull('deleted_at')->where('last_visit', '>', now()->subDays(30))->get()->count();
        $users_active_in_year_to_date = $user_model->whereNull('deleted_at')->where('last_visit', '>', now()->startOfYear())->get()->count();

        $this->setPanelData(
            "users_active_in_last_thirty_days", ["count" => $users_active_in_last_thirty_days]
        );

        $this->setPanelData(
            "users_active_in_year_to_date", ["count" => $users_active_in_year_to_date]
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
