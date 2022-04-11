<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CalendarResource\Pages;
use App\Filament\Resources\CalendarResource\RelationManagers;
use App\Models\Calendar;
use Filament\Forms;
use Filament\Pages\Actions\ButtonAction;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;

class CalendarResource extends Resource
{
    protected static ?string $model = Calendar::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar';

    protected static ?string $navigationGroup = 'Entities';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name'),
                Forms\Components\Placeholder::make('owner')
                    ->label('Owner')
                    ->content(fn (?Calendar $record): string => $record ? $record->user->username : '-'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name'),
                Tables\Columns\TextColumn::make('user.username')->label('Owner'),
                Tables\Columns\TextColumn::make('events_count')->counts('events'),
                Tables\Columns\TextColumn::make('date_created')->label('Created at')->date('Y-m-d'),
                Tables\Columns\TextColumn::make('last_dynamic_change')->label('Last Updated')->date('Y-m-d'),
            ])
            ->filters([
                //
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\UsersRelationManager::class,
            RelationManagers\EventsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCalendars::route('/'),
            'create' => Pages\CreateCalendar::route('/create'),
            'edit' => Pages\EditCalendar::route('/{record}/edit'),
        ];
    }
}
