<?php

namespace App\Filament\Pages;

use App\Filament\Pages\Statistics\Widgets\StatsOverviewWidget;
use App\Filament\Pages\Statistics\Widgets\SubRatio;
use App\Filament\Pages\Statistics\Widgets\SubsByTypeEachMonth;
use App\Filament\Pages\Statistics\Widgets\SubsOverTimeWidget;
use App\Filament\Pages\Statistics\Widgets\TotalUsersOverTime;
use App\Filament\Pages\Statistics\Widgets\UserGrowthPerMonth;
use Filament\Pages\Page;

class Statistics extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-presentation-chart-bar';

    protected static string $view = 'filament.pages.statistics';

    protected static ?int $navigationSort = 6;

    protected static ?string $navigationGroup = 'Administrative';

    protected function getHeaderWidgets(): array
    {
        return [
            StatsOverviewWidget::class,
            SubRatio::class,
            SubsByTypeEachMonth::class,
            SubsOverTimeWidget::class,
            TotalUsersOverTime::class,
            UserGrowthPerMonth::class,
        ];
    }
}
