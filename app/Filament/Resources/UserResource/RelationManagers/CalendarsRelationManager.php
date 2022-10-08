<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

use App\Filament\Resources\CalendarResource;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\RelationManagers\HasManyRelationManager;
use Filament\Resources\Table;
use Filament\Tables;

class CalendarsRelationManager extends HasManyRelationManager
{
    protected static string $relationship = 'calendars';

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name'),
                Forms\Components\Checkbox::make('disabled'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return CalendarResource::table($table);
    }
}
