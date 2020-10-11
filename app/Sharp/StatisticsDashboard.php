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
            SharpLineGraphWidget::make("users")
                ->setTitle("User growth per month")
    
        );
    }

    /**
     * Build dashboard's widgets layout.
     */
    protected function buildWidgetsLayout()
    {
        $this->addFullWidthWidget("users");
    }

    /**
     * Build dashboard's widgets data, using ->addGraphDataSet and ->setPanelData
     *
     * @param DashboardQueryParams $params
     */
    protected function buildWidgetsData(DashboardQueryParams $params)
    {

        $user = new User();

        $users_by_month = $user->where('active', 1)->get()
        ->groupBy(function($user) {
            return Carbon::parse($user->date_register)->format('Y-m');
        });

        $user_count_per_month = [];
        foreach ($users_by_month as $key => $value) {
            $user_count_per_month[$key] = count($value);
        }

        $this->addGraphDataSet(
            "users",
            SharpGraphWidgetDataSet::make($user_count_per_month)
                ->setLabel("Users")
                ->setColor("blue")
        );
    }
}
