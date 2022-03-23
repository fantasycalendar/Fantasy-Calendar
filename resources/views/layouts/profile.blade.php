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
                    </nav>
                </aside>

                <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
                    @if(session()->has('alert'))
                        <x-alert>
                            {{ session()->get('alert') }}
                        </x-alert>
                    @endif

                    {{ $slot }}
                </div>
            </div>
        </main>
    </div>
</x-app-layout>
