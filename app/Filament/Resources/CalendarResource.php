<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CalendarResource\Pages;
use App\Filament\Resources\CalendarResource\RelationManagers;
use App\Jobs\ConvertCalendarToPreset;
use App\Models\Calendar;
use DateTimeZone;
use Filament\Forms;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\TimePicker;
use Filament\Pages\Actions\ButtonAction;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CalendarResource extends Resource
{
    protected static ?string $model = Calendar::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar';

    protected static ?string $navigationGroup = 'Entities';

    protected static ?string $recordTitleAttribute = 'name';

    public static function getGloballySearchableAttributes(): array
    {
        return [
            'name',
            'user.username'
        ];
    }

    public static function getGlobalSearchResultDetails(Model $record): array
    {
        return [
            'Creator' => $record->user->username
        ];
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('General')->schema([
                    TextInput::make('name'),
                    Placeholder::make('owner')
                        ->label('Owner')
                        ->content(fn (?Calendar $record): string => $record ? $record->user->username : '-'),
                    TextInput::make('dynamic_data.year')->numeric()
                        ->label('Current Year'),
                    Select::make('dynamic_data.timespan')
                        ->label('Current Timespan')
                        ->options(fn(?Calendar $record): array => $record?->timespans->mapWithKeys(fn($timespan) => [$timespan->id => $timespan->name])->toArray()),
                    Select::make('dynamic_data.day')
                        ->label('Current Day')
                        ->options(fn(?Calendar $record): array => range(1, $record?->month->length)),
                    TextInput::make('dynamic_data.epoch')->disabled(),
                    TextInput::make('dynamic_data.location')->disabled(),
                    TextInput::make('dynamic_data.current_era')->disabled(),
                ])->columns(),
                Section::make('Real-Time Advancement')->schema([
                    Checkbox::make('advancement_enabled'),
                    DateTimePicker::make('advancement_next_due')
                        ->timezone(function($record){
                            return $record->advancement_timezone ?? 'UTC';
                        }),
                    TimePicker::make('advancement_time'),
                    Select::make('advancement_timezone')
                        ->options(collect(DateTimeZone::listIdentifiers())->mapWithKeys(fn($tz) => [$tz => $tz]))
                        ->searchable(),
                    TextInput::make('advancement_scale'),
                    TextInput::make('advancement_rate'),
                    Select::make('advancement_rate_unit')->options([
                        'minutes' => 'Minutes',
                        'hours' => 'Hours',
                        'days' => 'Days',
                    ]),
                    TextInput::make('advancement_webhook_url'),
                    Select::make('advancement_webhook_format')->options([
                        'discord'
                    ])->default('discord')
                ])->columns()
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
                Tables\Columns\BooleanColumn::make('deleted_at')
                    ->label('Active')
                    ->getStateUsing(fn($record) => is_null($record->deleted_at))
                    ->tooltip(fn($record) => $record->deleted_at ? 'Deleted at ' . $record->deleted_at->format('Y-m-d H:i:s') : 'Record is active.'),
            ])
            ->filters([
                Tables\Filters\Filter::make('advancement_enabled')
                    ->label('Has auto advancement enabled')
                    ->default(false)
                    ->query(fn(Builder $query): Builder => $query->whereAdvancementEnabled(true)),
                Tables\Filters\Filter::make('is_preset')
                    ->label('Is a preset')
                    ->default(false)
                    ->query(fn(Builder $query): Builder => $query->has('preset'))
            ])->prependActions([
                Tables\Actions\LinkAction::make('promote')
                    ->label('')
                    ->tooltip(fn(Calendar $record) => $record->preset ? 'Demote from preset' : 'Promote to preset')
                    ->icon(fn(Calendar $record) => $record->preset ? 'heroicon-s-arrow-circle-up' : 'heroicon-o-arrow-circle-up')
                    ->color(fn(Calendar $record) => $record->preset ? 'warning' : 'secondary')
                    ->action(fn(Calendar $record) => $record->preset ? $record->preset()->delete() : ConvertCalendarToPreset::dispatchSync($record)),
                Tables\Actions\LinkAction::make('feature')
                    ->label('')
                    ->icon(fn(Calendar $record) => $record->preset?->featured ? 'heroicon-s-star' : 'heroicon-o-star')
                    ->tooltip(fn(Calendar $record) => $record->preset?->featured ? 'Unfeature preset' : 'Feature preset')
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
            'edit' => Pages\EditCalendar::route('/{record}/edit'),
        ];
    }
}
