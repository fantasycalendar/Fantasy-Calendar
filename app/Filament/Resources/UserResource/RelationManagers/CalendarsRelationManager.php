<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

use App\Filament\Resources\CalendarResource;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CalendarsRelationManager extends RelationManager
{
    protected static string $relationship = 'calendars';

    protected static ?string $recordTitleAttribute = 'name';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name'),
                Forms\Components\Checkbox::make('disabled'),
            ]);
    }

    public function table(Table $table): Table
    {
        return CalendarResource::table($table->modifyQueryUsing(function (Builder $query) {
            $query->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
        }));
    }
}
