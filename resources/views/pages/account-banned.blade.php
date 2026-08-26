<x-app-layout body-class="flex flex-col bg-gray-100 dark:bg-gray-900">
    <x-panel class="max-w-3xl m-auto prose dark:prose-invert">
        <h1 class="text-red-500">Your account has been banned.</h1>
        <p><strong>Username:</strong> {{ $user->username }}</p>
        <p><strong>Banned reason:</strong> {{ $banned_reason }}</p>
        <p>If you believe this has been done in error, contact us through <a href="mailto:contact@fantasy-calendar.com?subject=Account Ban Dispute: {{ $user->username }}">contact@fantasy-calendar.com</a>.</p>
    </x-panel>
</x-app-layout>
