<?php

namespace App\Filament\Pages\Statistics\Widgets;

use Carbon\CarbonPeriod;
use Filament\Widgets\LineChartWidget;
use Flowframe\Trend\Trend;
use Laravel\Cashier\Subscription;

class SubsOverTimeWidget extends LineChartWidget
{
//    protected static string $view = 'filament.widgets.subs-over-time-widget';

    protected static ?int $sort = 1;
    protected static ?string $heading = 'Subscriptions over time';
    protected int | string | array $columnSpan = 12;

    protected function getData(): array
    {
        [$monthly_subscriptions_over_time, $yearly_subscriptions_over_time] = cache()->remember('subs_over_time', 300, function(){
            return self::queryData();
        });

        return [
            'datasets' => [
                [
                    'label' => 'Monthly',
                    'data' => $monthly_subscriptions_over_time,
                    'fill' => true,
                    'backgroundColor' => 'rgb(22 78 99)',
                    'borderColor' => 'rgb(8 145 178)',
                ],
                [
                    'label' => 'Yearly',
                    'data' => $yearly_subscriptions_over_time,
                    'fill' => true,
                    'backgroundColor' => 'rgb(127 29 29)',
                    'borderColor' => 'rgb(185 28 28)'
                ],
            ]
        ];
    }

    private static function queryData()
    {
        /* Total subscriptions per day */
        $monthly_subscriptions = Subscription::where('stripe_price', '=', 'timekeeper_monthly')
            ->where('created_at', '<', now()->subMonth()->lastOfMonth())
            ->where("stripe_status", "=", "active");

        $yearly_subscriptions = Subscription::where('stripe_price', '=', 'timekeeper_yearly')
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

        if($monthly->count() > 0) {
            $period = CarbonPeriod::create(
                min($monthly->keys()->first(), $yearly->keys()->first()),
                '1 month',
                max($monthly->keys()->last(), $yearly->keys()->last())
            );
        } else {
            $period = CarbonPeriod::create(
                now()->subMonths(12),
                '1 month',
                now()
            );
        }

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

        return [$monthly_subscriptions_over_time, $yearly_subscriptions_over_time];
    }
}
