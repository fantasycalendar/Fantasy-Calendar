<x-app-layout body-class="flex flex-col bg-gray-100 dark:bg-gray-900">
    <x-panel class="max-w-3xl m-auto">
        <div class="prose dark:prose-invert">
            <h1>Reject this invitation?</h1>
            <p class="pb-3"><strong>{{ $invitation->calendar->user->username }}</strong> invited you as a user on <strong>{{ $invitation->calendar->name }}</strong>.</p>
            <p>Rejecting this invitation cannot be undone, and they will have to invite you again if you change your mind. <br><br>
                    Are you sure?</p>
        </div>

        <x-slot name="footer_buttons">
            <form action="{{ route('invite.reject') }}" method="POST">
                @csrf
                <input type="hidden" name="token" value="{{ $invitation->invite_token }}">

                <x-button-link href="{{ route('calendars.index') }}">No, don't reject it.</x-button-link>
                <x-button role="danger" type="submit">Yes, reject this invitation.</x-button>
            </form>
        </x-slot>
    </x-panel>
</x-app-layout>
