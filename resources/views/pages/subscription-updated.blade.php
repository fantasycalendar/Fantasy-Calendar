<x-app-layout body-class="flex flex-col bg-gray-100 dark:bg-gray-900">
    <x-panel class="max-w-3xl m-auto prose dark:prose-invert">
            <h4 class="text-center pt-2">
                @if(Auth::user()->hasOptedInForMarketing())
                    You're now subscribed to our marketing emails!
                @else
                    You have successfully unsubscribed from our marketing emails
                @endif
            </h4>
        </div>
        <div class="card-body text-center">
            @if(Auth::user()->hasOptedInForMarketing())
                <p>Don't worry, we won't spam you. We'll only send you updates and information we think you'll actually like.</p>
            @else
                <p>If you didn't intend to do this, you can re-subscribe via your <a href="{{ route('profile') }}">user profile</a>.</p>
            @endif
        </div>
        <x-slot name="footer"></x-slot>
    </x-panel>
</x-app-layout>
