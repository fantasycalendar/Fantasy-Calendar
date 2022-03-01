<x-app-layout body-class="flex flex-col bg-gray-100 dark:bg-gray-900">
    <x-panel class="max-w-3xl m-auto prose dark:prose-invert">
            <h1>Account Deletion Request</h1>
            <p>At Fantasy-Calendar, we take your privacy seriously. If you feel the need to delete your account, we will do so as soon as possible, typically within 14 days.</p>
            <p class='mb-0'>We will delete all of the following on our servers, effectively removing it:</p>

            <ul>
                <li>Username</li>
                <li>Registration IP</li>
                <li>All of your calendars</li>
                <li>All event categories on your calendars</li>
                <li>All events on your calendars</li>
                <li>All comments on your events</li>
                <li>All of your active calendar invitations</li>
            </ul>

            <p>In addition, any active subscriptions will be cancelled.</p>

            <p class='mb-0'>For financial reasons, we need to retain information regarding your past subscriptions:</p>

            <ul>
                <li>Email Address</li>
                <li>The last used card brand</li>
                <li>The last four numbers of your card</li>
            </ul>

            <hr>

            <form action="/set-account-deletion" method="POST">
                @csrf

                <x-text-input label="Please enter your password to verify your identity:" class="mb-4" required type="password" name="password"></x-text-input>

{{--                @error('password')--}}
{{--                    <span class="invalid-feedback" role="alert">--}}
{{--                        <strong>{{ $message }}</strong>--}}
{{--                    </span>--}}
{{--                @enderror--}}

                <x-button role="danger" class="w-full justify-center" type="submit">Request Account Deletion</x-button>

            </form>
    </x-panel>
</x-app-layout>
