<?php

namespace App\Filament\Pages\Statistics\Widgets;

use App\Models\User;
use Filament\Widgets\LineChartWidget;
use Flowframe\Trend\Trend;
use Illuminate\Support\Carbon;

class TotalUsersOverTime extends LineChartWidget
{
    protected static ?string $heading = 'Total Users over time';

    protected static ?int $sort = 5;

    protected int | string | array $columnSpan = 6;

    protected function getData(): array
    {
        $usersOverTime = cache()->remember('total_users_over_time', 300, function() {
            return self::queryData();
        });
        return [
            'datasets' => [
                [
                    'label' => 'User count',
                    'data' => $usersOverTime,
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
                end: now()->startOfMonth()->subDay()
            )
            ->perMonth()
            ->count()
            ->withRunningTotal('aggregate')
            ->mapWithKeys(fn($trendValue) => [$trendValue->date => $trendValue->aggregate_running_total]);
    }
}
