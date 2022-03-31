<x-app-layout>
    <div class="h-full">
        <main class="max-w-7xl mx-auto pb-10">
            <div class="lg:grid lg:grid-cols-12 lg:gap-x-5">
                <aside class="pb-6 px-2 sm:px-6 lg:pb-0 lg:px-0 lg:col-span-3">
                    <nav class="space-y-1">
                        <x-left-nav-item icon="cog" label="Account" route="profile"></x-left-nav-item>
                        <x-left-nav-item icon="credit-card" label="Plan & Billing" route="profile.billing"></x-left-nav-item>

                        @if(config('services.discord.enabled'))
                            <x-left-nav-item icon="puzzle-piece" label="Integrations" route="profile.integrations"></x-left-nav-item>
                        @endif

                        @can('interact', \Laravel\Sanctum\PersonalAccessToken::class)
                            <div class="border-t dark:border-gray-800"></div>
                            <x-left-nav-item icon="key" label="Access Tokens" route="profile.api-tokens"></x-left-nav-item>
                        @endcan
                    </nav>
                </aside>

                <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
                    @if(session()->has('alert'))
                        <x-alert>
                            {{ session()->get('alert') }}
                        </x-alert>
                    @endif

                    @if(session()->has('error'))
                        <x-alert type="danger">
                            {{ session()->get('error') }}
                        </x-alert>
                    @endif

                    @if(session()->has('message'))
                        <x-alert type="success">
                            {{ session()->get('message') }}
                        </x-alert>
                    @endif

                    {{ $slot }}
                </div>
            </div>
        </main>
    </div>
</x-app-layout>
