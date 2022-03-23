<x-profile-layout>
    @if(config('services.discord.enabled'))
        <x-panel>
            <div class>
                <h2 id="billing-history-heading" class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">Discord Integration</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Connect your Discord account to Fantasy Calendar for quick access to common features.</p>

                <div class="border-t border-gray-100 dark:border-gray-700 w-full mt-6"></div>
            </div>

            <div class="flex items-center justify-between">
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
                        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 text-right sm:px-6 flex flex-col-reverse md:flex-row justify-between"
                            x-data
                            @modal-ok.window="($event.detail.name == 'disconnect_discord') && (self.location = '{{ route('discord.auth.remove') }}')">
                            <div class="flex flex-col md:items-center md:flex-row mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-gray-300 dark:border-gray-700">
                                <x-button class="justify-center" role="danger-subtle" @click="$dispatch('modal', { name: 'disconnect_discord'})">Disconnect Integration</x-button>
                                <x-modal name="disconnect_discord"
                                         icon="exclamation-triangle"
                                         icon-color="red"
                                         title="Are you sure?"
                                         body="Your Discord account will be disconnected from Fantasy Calendar. Commands will no longer work for you, but you will still need to remove the app from any servers you don't want it in in order to remove it completely."
                                         affirmative-color="red"
                                         affirmative-label="Yep, disconnect my account."
                                ></x-modal>
                            </div>
                            <div class="space-x-2 flex flex-col md:items-center md:flex-row space-y-2 md:space-y-0">
                                <x-button-link class="justify-center" role="secondary" :href="route('discord.index')">Command Reference</x-button-link>
                                <x-button-link class="justify-center" role="primary" :href="route('discord.auth.admin')">Add FC to a server</x-button-link>
                            </div>
                        </div>
                    </x-slot>
                @elseif(auth()->user()->isPremium())
                    <div class="flex flex-col space-y-4">
                        <div class="flex items-center">
                            <div class="h-12 w-12 rounded-full overflow-hidden mr-3 bg-white dark:bg-gray-500 border-2 border-gray-400 dark:border-gray-500 flex items-center justify-center">
                                <i class="fa fa-unlink text-xl text-gray-400 dark:text-gray-800"></i>
                            </div>
                            <div>
                                <h4 class="font-medium">Discord Integration <span class="ml-0.5 py-0.5 px-2 bg-gray-200 text-gray-800 font-bold text-xs rounded-lg dark:bg-gray-900 dark:text-gray-500">Not connected</span></h4>
                                <p class="text-sm text-gray-500 dark:text-gray-400">You can connect your Fantasy Calendar account to Discord! </p>
                            </div>
                        </div>
                        <x-alert>
                            Don't worry, we only use the minimum necessary to make integrations work. As Discord will tell you, neither of the options below lets us read your messages or anything like that.
                        </x-alert>
                    </div>

                    <x-slot name="footer">
                        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 text-right sm:px-6">
                            <x-button-link href="{{ route('discord.auth.user') }}">Connect your Discord account</x-button-link>
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
