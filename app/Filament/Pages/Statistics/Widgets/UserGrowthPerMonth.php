<?php

namespace App\Filament\Pages\Statistics\Widgets;

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
        $userGrowthPerMonth = cache()->remember('user_growth_per_month', 300, function(){
            return self::queryData();
        });

        return [
            'datasets' => [
                [
                    'label' => 'User count',
                    'data' => $userGrowthPerMonth,
                    'fill' => true,
                    'backgroundColor' => 'rgb(22 78 99)',
                    'borderColor' => 'rgb(8 145 178)',
                ]
            ]
        ];
    }

    private function queryData()
    {
        return Trend::model(User::class)
            ->between(
                start: Carbon::parse('2017-12-01'),
                end: now()->startOfMonth()->subday()
            )->perMonth()
            ->count()
            ->mapWithKeys(fn($trendValue) => [$trendValue->date => $trendValue->aggregate]);
    }
}
