<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\LineChartWidget;
use Filament\Widgets\Widget;
use Flowframe\Trend\Trend;
use Illuminate\Support\Carbon;

class UserGrowthPerMonth extends LineChartWidget
{
    protected static ?string $heading = 'User growth per month';

    protected static ?int $sort = 4;

    protected int | string | array $columnSpan = 6;

    protected function getData(): array
    {
        $userGrowthPerMonth = Trend::model(User::class)
            ->between(
                start: Carbon::parse('2017-12-01'),
                end: now()->startOfMonth()->subday()
            )->perMonth()
            ->count()
            ->mapWithKeys(fn($trendValue) => [$trendValue->date => $trendValue->aggregate]);

        return [
            'datasets' => [
                [
                    'data' => $userGrowthPerMonth,
                    'fill' => true,
                    'backgroundColor' => 'rgb(22 78 99)',
                    'borderColor' => 'rgb(8 145 178)',
                ]
            ]
        ];
    }
}
