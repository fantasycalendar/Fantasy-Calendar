<?php

namespace App\Filament\Resources\CalendarResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\HasManyRelationManager;
use Filament\Tables\Table;
use Filament\Tables;

class EventsRelationManager extends \Filament\Resources\RelationManagers\RelationManager
{
    protected static string $relationship = 'events';

    protected static ?string $recordTitleAttribute = 'name';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name'),
            ])
            ->filters([
                //
            ]);
    }
}
