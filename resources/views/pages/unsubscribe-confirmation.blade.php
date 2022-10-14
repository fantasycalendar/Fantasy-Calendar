<x-app-layout body-class="flex flex-col bg-gray-100 dark:bg-gray-900">
    <x-panel class="max-w-3xl m-auto">
        @if(auth()->user()->hasOptedInForMarketing())
            <div class="prose dark:prose-invert mx-auto">
                <h1 class="text-center py-5">Unsubscribe from Fantasy Computerworks emails</h1>

                <h2>Are you sure?</h2>
                <p>We understand, no hard feelings at all. However, if you could
                    <a href="mailto:contact@fantasy-calendar.com">send us a note</a> letting us know why,
                    we'd really appreciate it. <br><br>Fantasy Calendar is a passion project that we do for fun,
                    so we'd love to hear from you.

                    We make it a point to only announce new things that we think will excite you, and we
                    definitely don't want to annoy you.
                </p>
            </div>

            <x-alert>
                <div>
                    You can always change your mind on your <a href="{{ route('profile') }}">profile page</a>.
                </div>
            </x-alert>

            <x-slot name="footer_buttons">
                <form action="{{ route('marketing.unsubscribe') }}" method="post">
                    @csrf
                    <x-button-link href="{{ route('calendars.index') }}">No, I clicked the link by accident.</x-button-link>
                    <x-button type="submit" role="danger">Yes, stop sending me emails.</x-button>
                </form>
            </x-slot>
        @else
            <div class="prose dark:prose-invert mx-auto">
                <h1 class="text-center py-5">Resubscribe to Fantasy Computerworks emails</h1>
                <h2>You're unsubscribed!</h2>
                <p>It looks like you're already unsubscribed.<br><br>Did you want to re-subscribe?</p>
            </div>
            <x-alert>
                <div>
                    You can always change your mind on your <a href="{{ route('profile') }}">profile page</a>
                </div>
            </x-alert>
        @endif

        <x-slot name="footer_buttons">
            <form class="form-inline px-2" action="{{ route('marketing.resubscribe') }}" method="post">
                @csrf
                <x-button-link role="secondary" href="{{ route('calendars.index') }}">No, I clicked the link by accident.</x-button-link>
                <x-button type="submit" role="primary">Yes, please resubscribe me!</x-button>
            </form>
        </x-slot>
    </x-panel>
</x-app-layout>
