<x-app-layout body-class="flex flex-col bg-gray-100 dark:bg-gray-900">
    <x-panel class="max-w-3xl m-auto">
        <x-alert type="success" class="text-xl">
            @if(Auth::user()->hasOptedInForMarketing())
                You're now subscribed to our marketing emails!
            @else
                You have successfully unsubscribed from our marketing emails
            @endif

                <div>
                    @if(Auth::user()->hasOptedInForMarketing())
                        Don't worry, we won't spam you. We'll only send you updates and information we think you'll actually like.
                    @else
                        If you didn't intend to do this, you can re-subscribe via your <a href="{{ route('profile') }}">user profile</a>.
                    @endif
                </div>
        </x-alert>

        <x-slot name="footer_buttons">
            <x-button-link href="{{ route('calendars.index') }}">Back to My Calendars</x-button-link>
        </x-slot>
    </x-panel>
</x-app-layout>
