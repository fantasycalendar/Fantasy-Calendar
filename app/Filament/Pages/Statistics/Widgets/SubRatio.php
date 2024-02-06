<?php

namespace App\Filament\Pages\Statistics\Widgets;

use Filament\Widgets\PieChartWidget;
use Laravel\Cashier\Subscription;

class SubRatio extends PieChartWidget
{
    protected static ?string $heading = 'Subscription ratio';
    protected static ?int $sort = 2;
    protected int | string | array $columnSpan = 4;

    protected function getData(): array
    {
        return [
            'labels' => [
                'Monthly',
                'Yearly'
            ],
            'datasets' => [
                [
                    'label' => 'Subscription ratio',
                    'data' => [
                        Subscription::where('stripe_status', '=','active')->where('stripe_price', '=', 'timekeeper_monthly')->count(),
                        Subscription::where('stripe_status', '=','active')->where('stripe_price', '=', 'timekeeper_yearly')->count(),
                    ],
                    'backgroundColor' => [
                        'rgb(8 145 178)',
                        'rgb(185 28 28)',
                    ]
                ]
            ]
        ];
    }
}
