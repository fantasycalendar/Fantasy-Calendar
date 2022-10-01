<?php

namespace App\Filament\Pages\Statistics\Widgets;

use Carbon\CarbonPeriod;
use Filament\Widgets\BarChartWidget;
use Flowframe\Trend\Trend;
use Illuminate\Support\Carbon;
use Laravel\Cashier\Subscription;

class SubsByTypeEachMonth extends BarChartWidget
{
    protected static ?string $heading = 'Subscriptions per month by type';

    protected static ?int $sort = 2;

    protected int | string | array $columnSpan = 10;

    protected function getData(): array
    {
        $monthly_subscriptions_per_month = Trend::query(
            Subscription::where('stripe_plan', 'timekeeper_monthly')->where('created_at', '<', now()->subMonth()->lastOfMonth())
        )->between(
            start: Carbon::parse('2020-10-01'),
            end: now()
        )
            ->perMonth()
            ->count()
            ->mapWithKeys(fn($trendValue) => [$trendValue->date => $trendValue->aggregate]);

        $yearly_subscriptions_per_month = Trend::query(
            Subscription::where('stripe_plan', 'timekeeper_yearly')->where('created_at', '<', now()->subMonth()->lastOfMonth())
        )->between(
            start: Carbon::parse('2020-10-01'),
            end: now()
        )
            ->perMonth()
            ->count()
            ->mapWithKeys(fn($trendValue) => [$trendValue->date => $trendValue->aggregate]);

        return [
            'datasets' => [
                [
                    'label' => 'Monthly',
                    'data' => $monthly_subscriptions_per_month,
                    'fill' => true,
                    'backgroundColor' => 'rgb(22 78 99)',
                    'borderColor' => 'rgb(8 145 178)',
                ],
                [
                    'label' => 'Yearly',
                    'data' => $yearly_subscriptions_per_month,
                    'fill' => true,
                    'backgroundColor' => 'rgb(127 29 29)',
                    'borderColor' => 'rgb(185 28 28)'
                ],
            ]
        ];
    }
}
