<?php

namespace App\Sharp;

use App\User;

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
    
        );
    }

    /**
     * Build dashboard's widgets layout.
     */
    protected function buildWidgetsLayout()
    {
        $this->addFullWidthWidget("usergrowth_month")
            ->addFullWidthWidget("users_over_time");
    }

    /**
     * Build dashboard's widgets data, using ->addGraphDataSet and ->setPanelData
     *
     * @param DashboardQueryParams $params
     */
    protected function buildWidgetsData(DashboardQueryParams $params)
    {

        $user = new User();

        $users = $user->where('active', 1)->where('date_register', '<', now()->firstOfMonth())->get();

        $user_count_per_month = $users
            ->groupBy(function($user) {
                return Carbon::parse($user->date_register)->format('Y-m');
            })->mapWithKeys(function($users, $date) {
                return [$date => count($users)];
            });
        
        $total_users = 0;
        foreach ($user_count_per_month as $date => $number_of_users) {
            $user_count_over_time[$date] = $number_of_users + $total_users;
            $total_users += $number_of_users;
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
    }
}
