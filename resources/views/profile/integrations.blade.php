<x-profile-layout>
    @if(config('services.discord.enabled'))
        @include('Discord::integration-panel')
    @endif
</x-profile-layout>
