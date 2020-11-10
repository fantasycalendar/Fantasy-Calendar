<?php

namespace App\Sharp;

use App\User;

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


        /* Monthly subscribers per day */

        $monthly_subscriptions = $subscription_model->where('stripe_plan', '=', 'timekeeper_monthly')->get();
        $monthly_grouped_subscription = $monthly_subscriptions->groupBy(function($subscription) {
            return Carbon::parse($subscription->created_at)->format('Y-m-d');
        })->mapWithKeys(function($subscriptions, $date) {
            return [$date => count($subscriptions)];
        });

        $monthly_total_subscriptions = 0;
        $monthly_subscriptions_over_time = [];
        foreach ($monthly_grouped_subscription as $date => $number_of_subscriptions) {
            $monthly_subscriptions_over_time[$date] = $number_of_subscriptions + $monthly_total_subscriptions;
            $monthly_total_subscriptions += $number_of_subscriptions;
        }

        
        /* Yearly subscribers per day */

        $yearly_subscriptions = $subscription_model->where('stripe_plan', '=', 'timekeeper_yearly')->get();
        $yearly_grouped_subscription = $yearly_subscriptions->groupBy(function($subscription) {
            return Carbon::parse($subscription->created_at)->format('Y-m-d');
        })->mapWithKeys(function($subscriptions, $date) {
            return [$date => count($subscriptions)];
        });

        $yearly_total_subscriptions = 0;
        $yearly_subscriptions_over_time = [];
        foreach ($yearly_grouped_subscription as $date => $number_of_subscriptions) {
            $yearly_subscriptions_over_time[$date] = $number_of_subscriptions + $yearly_total_subscriptions;
            $yearly_total_subscriptions += $number_of_subscriptions;
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
