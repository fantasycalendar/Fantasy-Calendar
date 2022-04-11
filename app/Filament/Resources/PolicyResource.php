<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PolicyResource\Pages;
use App\Filament\Resources\PolicyResource\RelationManagers;
use App\Models\Policy;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;

class PolicyResource extends Resource
{
    protected static ?string $model = Policy::class;

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-list';

    protected static ?string $navigationGroup = 'Legal Stuff';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Placeholder::make('id')->content(fn(?Policy $record) => $record->id),
                Forms\Components\Placeholder::make('created_at')->content(fn(?Policy $record) => $record->created_at),
                Forms\Components\Placeholder::make('updated_at')->content(fn(?Policy $record) => $record->updated_at),
                Forms\Components\Placeholder::make('in_effect_at')->content(fn(?Policy $record) => $record->in_effect_at),
                Forms\Components\Section::make('Full Content')->schema([
                    Forms\Components\RichEditor::make('content'),
                ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id'),
                Tables\Columns\TextColumn::make('created_at')->date('Y-m-d'),
                Tables\Columns\TextColumn::make('updated_at')->date('Y-m-d'),
                Tables\Columns\TextColumn::make('in_effect_at')->date('Y-m-d'),
            ])
            ->filters([
                //
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }


    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPolicies::route('/'),
            'create' => Pages\CreatePolicy::route('/create'),
            'edit' => Pages\EditPolicy::route('/{record}/edit'),
        ];
    }
}
