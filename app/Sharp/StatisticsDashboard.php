<?php

namespace App\Sharp;

use App\User;

use Carbon\CarbonPeriod;
use Illuminate\Support\Arr;
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
            SharpLineGraphWidget::make("usergrowth_month")
                ->setTitle("User growth per month")

        )->addWidget(
            SharpLineGraphWidget::make("users_over_time")
                ->setTitle("Total users over time")

        )->addWidget(
            SharpLineGraphWidget::make("agreement_over_time")
                ->setTitle("2.0 Users Over Time")

        )->addWidget(
            SharpLineGraphWidget::make("subs_over_time")
                ->setTitle("Subscriptions")

        );
    }

    /**
     * Build dashboard's widgets layout.
     */
    protected function buildWidgetsLayout()
    {
        $this->addFullWidthWidget("usergrowth_month")
            ->addFullWidthWidget("users_over_time")
            ->addFullWidthWidget("agreement_over_time")
            ->addFullWidthWidget("subs_over_time");
    }

    /**
     * Build dashboard's widgets data, using ->addGraphDataSet and ->setPanelData
     *
     * @param DashboardQueryParams $params
     */
    protected function buildWidgetsData(DashboardQueryParams $params)
    {

        $user_model = new User();
        $subscription_model = new Subscription();


        /* User growth and total users */

        $users = $user_model->whereNull('deleted_at')->where('created_at', '<', now()->firstOfMonth())->get();

        $user_count_per_month = $users
            ->groupBy(function($user) {
                return Carbon::parse($user->created_at)->format('Y-m');
            })->mapWithKeys(function($users, $date) {
                return [$date => count($users)];
            });

        $total_users = 0;
        foreach ($user_count_per_month as $date => $number_of_users) {
            $user_count_over_time[$date] = $number_of_users + $total_users;
            $total_users += $number_of_users;
        }


        /* Total users converted to 2.0 per day */

        $agreed_users = $user_model->whereNull('deleted_at')->where('agreed_at', '<', now())->get();

        $user_agreements_per_day = $agreed_users
            ->groupBy(function($user) {
                return Carbon::parse($user->created_at)->format('Y-m-d');
            })->mapWithKeys(function($users, $date) {
                return [$date => count($users)];
            });

        $total_users = 0;
        $user_agreement_over_time = [];
        foreach ($user_agreements_per_day as $date => $number_of_users) {
            $user_agreement_over_time[$date] = $number_of_users + $total_users;
            $total_users += $number_of_users;
        }


        $period = CarbonPeriod::create(now()->subDays(14),now());

        $monthly_subscriptions = $subscription_model->where('stripe_plan', '=', 'timekeeper_monthly')->get();
        $yearly_subscriptions = $subscription_model->where('stripe_plan', '=', 'timekeeper_yearly')->get();

        $yearly_subscriptions_over_time = [];
        $monthly_subscriptions_over_time = [];

        foreach($period as $dateObject) {
            $date = $dateObject->format('Y-m-d');

            $yearly_subscriptions_over_time[$date] = $yearly_subscriptions->where('created_at', '<', $date)->count();
            $monthly_subscriptions_over_time[$date] = $monthly_subscriptions->where('created_at', '<', $date)->count();
        }

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

        $this->addGraphDataSet(
            "subs_over_time",
            SharpGraphWidgetDataSet::make($monthly_subscriptions_over_time)
                ->setLabel("Monthly")
                ->setColor("blue")
        );

        $this->addGraphDataSet(
            "subs_over_time",
            SharpGraphWidgetDataSet::make($yearly_subscriptions_over_time)
                ->setLabel("Yearly")
                ->setColor("red")
        );
    }

}
