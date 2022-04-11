<?php

namespace App\Filament\Resources\CalendarResource\Pages;

use App\Filament\Resources\CalendarResource;
use Filament\Pages\Actions\ButtonAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;

class EditCalendar extends EditRecord
{
    protected static string $resource = CalendarResource::class;

    protected function getActions(): array
    {
        return [
            ButtonAction::make('edit_page')
                ->label('Edit Page')
                ->url(route('calendars.edit', ['calendar' => $this->record])),
            ...parent::getActions()
        ];
    }

    protected function afterSave(): void
    {
        $this->record->ensureCurrentEpoch()->save();
    }
}
