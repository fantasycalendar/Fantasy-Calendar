<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;

class EnvVars extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static string $view = 'filament.pages.env-vars';

    protected static ?string $navigationGroup = 'Administrative';

    protected static ?int $navigationSort = 3;
}
