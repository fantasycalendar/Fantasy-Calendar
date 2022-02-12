<x-profile-layout>
    @if(config('services.discord.enabled'))
        <x-panel>
            <div class="px-4 sm:px-6">
                <h2 id="billing-history-heading" class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">Discord Integration</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Connect your Discord account to Fantasy Calendar, for quick access to some common features.</p>

                <div class="border-t border-gray-100 dark:border-gray-700 w-full px-4 sm:px-6 mt-6"></div>
            </div>

            <div class="flex items-center justify-between px-4 sm:px-6">
                @if(auth()->user()->hasDiscord())
                    <div class="flex items-center">
                        <div class="h-12 w-12 rounded-full overflow-hidden mr-3 bg-gray-900 dark:bg-gray-500 border-2 border-gray-900 dark:border-gray-500">
                            <img src="{{ auth()->user()->discord_auth->avatar }}" alt="" class="bg-white h-full w-full">
                        </div>
                        <div>
                            <h4 class="font-medium">Discord Integration <span class="ml-0.5 py-0.5 px-2 bg-green-200 text-green-800 font-bold text-xs rounded-lg dark:bg-green-900 dark:text-green-500">Connected</span></h4>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Integrated with discord as <strong>{{ auth()->user()->discord_auth->discord_username }}</strong>.</p>
                        </div>
                    </div>
                    <x-slot name="footer">
                        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 text-right sm:px-6">
                            <x-button-link role="secondary" href="{{ route('discord.index') }}">Manage Integration</x-button-link>
                        </div>
                    </x-slot>
                @elseif(auth()->user()->isPremium())
                    <div class="flex items-center">
                        <div class="h-12 w-12 rounded-full overflow-hidden mr-3 bg-white dark:bg-gray-500 border-2 border-gray-400 dark:border-gray-500 flex items-center justify-center">
                            <i class="fa fa-unlink text-xl text-gray-400 dark:text-gray-800"></i>
                        </div>
                        <div>
                            <h4 class="font-medium">Discord Integration <span class="ml-0.5 py-0.5 px-2 bg-gray-200 text-gray-800 font-bold text-xs rounded-lg dark:bg-gray-900 dark:text-gray-500">Not connected</span></h4>
                            <p class="text-sm text-gray-500 dark:text-gray-400">You can connect your Fantasy Calendar account to Discord!</p>
                        </div>
                    </div>
                    <x-slot name="footer">
                        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 text-right sm:px-6">
                            <x-button-link href="{{ route('discord.index') }}">Check it out</x-button-link>
                        </div>
                    </x-slot>
                @else
                    <div class="flex items-cetnter">
                        <div class="h-12 w-12 rounded-full overflow-hidden mr-3 bg-white dark:bg-gray-500 border-2 border-gray-400 dark:border-gray-500 flex items-center justify-center">
                            <i class="fa fa-search-dollar text-xl text-gray-400 dark:text-gray-800"></i>
                        </div>
                        <div>
                            <h4 class="font-medium">Discord Integration <span class="ml-0.5 py-0.5 px-2 bg-orange-200 text-orange-800 font-bold text-xs rounded-lg dark:bg-orange-900 dark:text-orange-500">Subscriber only</span></h4>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Subscribe today to use Fantasy Calendar directly from Discord!</p>
                        </div>
                    </div>
                    <x-slot name="footer">
                        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 text-right sm:px-6">
                            <x-button-link href="{{ route('discord') }}">Check it out</x-button-link>
                        </div>
                    </x-slot>
                @endif
            </div>
        </x-panel>
    @endif
</x-profile-layout>
