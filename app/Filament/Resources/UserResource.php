<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Filament\Tables;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Password;
use STS\FilamentImpersonate\Tables\Actions\Impersonate;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';

    protected static ?string $navigationGroup = 'Entities';

    protected static ?string $recordTitleAttribute = 'username';

    public static function getGloballySearchableAttributes(): array
    {
        return [
            'username',
            'email'
        ];
    }

    public static function getGlobalSearchResultDetails(Model $record): array
    {
        return [
            'Email' => $record->email,
        ];
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Personal Info')->schema([
                    Forms\Components\TextInput::make('username'),
                    Forms\Components\TextInput::make('email'),
                    Forms\Components\DateTimePicker::make('email_verified_at')->label('Verified At'),
                    Forms\Components\DateTimePicker::make('date_register')->label('Created at')->disabled(),
                    Forms\Components\DateTimePicker::make('last_visit')->disabled(),
                ])->columns(),
                Forms\Components\Section::make('User Management')->schema([
                    Forms\Components\DateTimePicker::make('banned_at')->label('Banned At'),
                    Forms\Components\TextInput::make('banned_reason')->label('Banned Reason')
                ])->columns(),
                Forms\Components\Section::make('Access Info')->schema([
                    Forms\Components\Select::make('permissions')
                        ->options([
                            '1' => 'Admin',
                            '6' => 'Normal User'
                        ])
                        ->disabled(),
                    Forms\Components\Checkbox::make('beta_authorised'),
                    Forms\Components\Checkbox::make('is_early_supporter')
                        ->formatStateUsing(fn (User $record) => $record->is_early_supporter)
                        ->disabled(),
                ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('username')->searchable(),
                Tables\Columns\TextColumn::make('email')->searchable(),
                Tables\Columns\TextColumn::make('permissions'),
                Tables\Columns\BooleanColumn::make('beta_authorised')->label('Beta Access'),
                Tables\Columns\TextColumn::make('created_at'),
                Tables\Columns\TextColumn::make('email_verified_at')
            ])
            ->filters([
                Tables\Filters\Filter::make('beta_authorised')
                    ->query(fn(Builder $query): Builder => $query->where('beta_authorised', true))
            ])->actions([
                Impersonate::make(),
            ])->bulkActions([
                Tables\Actions\BulkAction::make('password_reset')
                    ->action(function($records){
                        foreach($records as $record) {
                            $broker = Password::broker();

                            $broker->sendResetLink([
                                'email' => $record->email
                            ]);
                        }

                        return true;
                    })
                    ->requiresConfirmation()
                    ->label('Send password reset')
                    ->color('warning')
                    ->icon('heroicon-o-inbox-arrow-down')
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\CalendarsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
