<?php

namespace App\Filament\Resources\CalendarResource\RelationManagers;

use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\RelationManagers\HasManyRelationManager;
use Filament\Resources\Table;
use Filament\Tables;

class UsersRelationManager extends HasManyRelationManager
{
    protected static string $relationship = 'users';

    protected static ?string $recordTitleAttribute = 'username';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                //
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('username'),
                Tables\Columns\BooleanColumn::make('is_premium')->label('Is Premium'),
            ])
            ->filters([
                //
            ]);
    }
}
