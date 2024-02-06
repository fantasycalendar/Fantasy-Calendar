<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AgreementResource\Pages;
use App\Filament\Resources\AgreementResource\RelationManagers;
use App\Models\Agreement;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Filament\Tables;

class AgreementResource extends Resource
{
    protected static ?string $model = Agreement::class;

    protected static ?string $navigationIcon = 'heroicon-o-clipboard';

    protected static ?string $navigationGroup = 'Legal Stuff';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Placeholder::make('id')->content(fn(?Agreement $record) => $record->id),
                Forms\Components\Placeholder::make('created_at')->content(fn(?Agreement $record) => $record->created_at),
                Forms\Components\Placeholder::make('updated_at')->content(fn(?Agreement $record) => $record->updated_at),
                Forms\Components\Placeholder::make('in_effect_at')->content(fn(?Agreement $record) => $record->in_effect_at),
                Forms\Components\Section::make('Full Content')->schema([
                    Forms\Components\MarkdownEditor::make('content'),
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
            'index' => Pages\ListAgreements::route('/'),
            'create' => Pages\CreateAgreement::route('/create'),
            'edit' => Pages\EditAgreement::route('/{record}/edit'),
        ];
    }
}
