<x-app-layout body-class="flex flex-col bg-gray-100 dark:bg-gray-900">
    <x-panel class="max-w-3xl m-auto prose dark:prose-invert">
        <h1 class="text-red-500">Your account has been marked for deletion.</h1>
        <p><strong>Username:</strong> {{ $user->username }}</p>
        <p><strong>Requested at:</strong> {{ $requested_at }}</p>

        <p>If you do nothing, your account will be deleted at {{ $delete_at }}.</p>

        <x-button-link href="cancel-account-deletion">Stop account deletion</x-button-link>

        <x-slot name="footer"></x-slot>
    </x-panel>
</x-app-layout>
