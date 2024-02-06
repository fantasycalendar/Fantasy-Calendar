<?php

namespace App\Filament\Resources\CalendarResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\HasManyRelationManager;
use Filament\Tables\Table;
use Filament\Tables;

class UsersRelationManager extends \Filament\Resources\RelationManagers\RelationManager
{
    protected static string $relationship = 'users';

    protected static ?string $recordTitleAttribute = 'username';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                //
            ]);
    }

    public function table(Table $table): Table
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
