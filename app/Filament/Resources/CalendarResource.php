<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CalendarResource\Pages;
use App\Filament\Resources\CalendarResource\RelationManagers;
use App\Jobs\ConvertCalendarToPreset;
use App\Models\Calendar;
use Filament\Forms;
use Filament\Pages\Actions\ButtonAction;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;
use Illuminate\Database\Eloquent\Builder;

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
                Tables\Filters\Filter::make('is_preset')
                    ->label('Is a preset')
                    ->default(false)
                    ->query(fn(Builder $query): Builder => $query->has('preset'))
            ])->prependActions([
                Tables\Actions\LinkAction::make('promote')
                    ->label(fn(Calendar $record) => $record->preset ? 'Demote from preset' : 'Promote to preset')
                    ->icon(fn(Calendar $record) => $record->preset ? 'heroicon-o-chevron-double-down' : 'heroicon-o-chevron-double-up')
                    ->color(fn(Calendar $record) => $record->preset ? 'warning' : 'secondary')
                    ->action(fn(Calendar $record) => $record->preset ? $record->preset()->delete() : ConvertCalendarToPreset::dispatchSync($record)),
                Tables\Actions\LinkAction::make('feature')
                    ->label('')
                    ->icon(fn(Calendar $record) => $record->preset?->featured ? 'heroicon-s-star' : 'heroicon-o-star')
                    ->color(fn(Calendar $record) => $record->preset?->featured ? 'warning' : 'secondary')
                    ->action(fn(Calendar $record) => $record->preset?->featured ? $record->preset->unFeature() : $record->preset->feature())
                    ->disabled(fn(Calendar $record) => (bool) !$record->preset),
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
