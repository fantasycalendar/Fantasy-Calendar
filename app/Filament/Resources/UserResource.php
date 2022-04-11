<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;
use Illuminate\Database\Eloquent\Builder;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-collection';

    protected static ?string $navigationGroup = 'Entities';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Personal Info')->schema([
                    Forms\Components\TextInput::make('username'),
                    Forms\Components\TextInput::make('email'),
                    Forms\Components\DatePicker::make('date_register')->label('Created at')->disabled(),
                    Forms\Components\DatePicker::make('last_visited')->disabled(),
                ])->columns(),
                Forms\Components\Section::make('Access Info')->schema([
                    Forms\Components\Select::make('permissions')
                        ->options([
                            '1' => 'Admin',
                            '6' => 'Normal User'
                        ])
                        ->disabled(),
                    Forms\Components\Checkbox::make('beta_authorised'),
                    Forms\Components\Checkbox::make('is_early_supporter')->disabled(),
                ])
            ]);
    }

    public static function table(Table $table): Table
    {
        ld(request()->url());

        return $table
            ->columns([
                Tables\Columns\TextColumn::make('username'),
                Tables\Columns\TextColumn::make('email'),
                Tables\Columns\TextColumn::make('permissions'),
                Tables\Columns\BooleanColumn::make('beta_authorised')->label('Beta Access'),
                Tables\Columns\TextColumn::make('created_at'),
                Tables\Columns\TextColumn::make('email_verified_at')
            ])
            ->filters([
                Tables\Filters\Filter::make('identity')
                    ->form([
                        Forms\Components\TextInput::make('identity')
                            ->default('')
                    ])
                    ->query(function(Builder $query, $data): Builder {
                        return $query
                            ->when(
                                $data['identity'],
                                fn(Builder $query, $identity) => $query
                                    ->where('username', 'like', "%$identity%")
                                    ->orWhere('email', 'like', "%$identity%")
                            );
                    }),
                Tables\Filters\Filter::make('beta_authorised')
                    ->query(fn(Builder $query): Builder => $query->where('beta_authorised', true))
            ])->prependActions([
                Tables\Actions\ButtonAction::make('impersonate')
                    ->label('Impersonate')
                    ->icon('heroicon-o-user-circle')
                    ->url(fn($record) => route('admin.impersonate', ['userid' => $record->id, 'returnPath' => request()->url()]))
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
