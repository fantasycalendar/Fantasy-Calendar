<x-app-layout body-class="flex flex-col bg-gray-100 dark:bg-gray-900">
    <x-panel class="max-w-3xl m-auto">
        <div class="prose dark:prose-invert">
            <h1>Invite Accepted!</h1>
            <p>You've already accepted {{ $calendar->user->username }}'s invitation to join {{ $calendar->name }}.</p>
        </div>

        <x-slot name="footer_buttons">
            <x-button-link role="secondary" href="{{ route('calendars.index') }}" class="btn btn-secondary">Return to Your Calendars</x-button-link>
            <x-button-link href="{{ route('calendars.show', ['calendar' => $calendar]) }}" class="btn btn-primary">View {{ $calendar->name }} now</x-button-link>
        </x-slot>
    </x-panel>
</x-app-layout>
