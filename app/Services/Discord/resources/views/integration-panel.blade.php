@push('head')
    <script>
        function WebhooksList() {
            return {
                expanded: -1,
                init() {
                    let url = new URL(location.href);

                    if(url.searchParams.get('discord_panel_open')) {
                        url.searchParams.delete('discord_panel_open');

                        window.history.replaceState(
                            history.state,
                            document.title,
                            url.toString()
                        );
                    }
                },
                modal_ok($event) {
                    switch($event.detail.name) {
                        case 'delete_webhook_confirmation':
                            this.delete_webhook($event.detail.url);
                            break;
                        case 'delete_webhook_confirm':
                            const url = new URL(location.href);
                            url.searchParams.set('discord_panel_open', 'true');

                            location.assign(url.toString());
                            break;
                        default:
                            console.log(`Unhandled event named ${$event.detail.name}`);
                            break;
                    }
                },
                modal_cancel($event) {
                    if($event.detail.name === 'copy_confirm') {
                        location.reload();
                    }
                },
                update_webhook(url, payload) {
                    console.log(`Updating ${url} with info`, payload);

                    axios
                        .patch(url, payload)
                        .then(results => {
                            if(results.data.error) {
                                throw "Error: " + results.data.message;
                            }

                            this.dispatch('notification', {
                                title: 'Webhook updated!',
                                body: "",
                                sticky: false,
                            });
                        })
                        .catch(err => {
                            console.error(err);
                        });
                },
                delete_webhook(url) {
                    console.log(`Would have tried to delete ${url}`);
                    axios
                        .delete(url)
                        .then(results => {
                            if(results.data.error) {
                                throw "Error: " + results.data.message;
                            }

                            this.dispatch('modal', {
                                name: 'delete_webhook_confirm',
                            });
                        })
                        .catch(err => {
                            console.error(err);
                        });
                },
                // Yea replicating $dispatch here, like this, is sorta a hack
                // However, it's easier (and cleaner, imho) than just passing
                // $dispatch around through various layers of function scopes
                dispatch(name, event) {
                    this.$el.dispatchEvent(new CustomEvent(name, {
                        bubbles: true,
                        detail: event
                    }));
                }
            }
        }
    </script>
@endpush

<x-panel x-data="{ openDiscordWebhooksSidebar: false }" x-init="openDiscordWebhooksSidebar = (new URL(location.href)).searchParams.get('discord_panel_open')">
    <div class>
        <h2 id="billing-history-heading" class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">Discord Integration</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Connect your Discord account to Fantasy Calendar for quick access to common features.</p>

        <div class="border-t border-gray-100 dark:border-gray-700 w-full mt-6"></div>
    </div>

    <div class="flex items-center justify-between">
        @if(auth()->user()->hasDiscord())
            <div class="flex items-center w-full">
                <div class="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden mr-3 bg-gray-900 dark:bg-gray-500 border-2 border-gray-900 dark:border-gray-500">
                    <img src="{{ auth()->user()->discord_auth->avatar }}" alt="" class="bg-white h-full w-full">
                </div>
                <div class="flex-grow">
                    <h4 class="font-medium">Discord Integration <span class="ml-0.5 py-0.5 px-2 bg-green-200 text-green-800 font-bold text-xs rounded-lg dark:bg-green-900 dark:text-green-500">Connected</span></h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Integrated with discord as <strong>{{ auth()->user()->discord_auth->discord_username }}</strong>.</p>
                </div>
                <div class="justify-self-end">
                    <x-button @click="openDiscordWebhooksSidebar = true">
                        Manage webhooks
                    </x-button>
                </div>
            </div>
            <x-slot name="footer">
                <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 text-right sm:px-6 flex flex-col-reverse md:flex-row justify-between"
                     x-data
                     @modal-ok.window="($event.detail.name == 'disconnect_discord') && (self.location = '{{ route('discord.auth.remove') }}')">
                    <div class="flex flex-col md:items-center md:flex-row mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-gray-300 dark:border-gray-700">
                        <x-button class="justify-center" role="danger-subtle" @click="$dispatch('modal', { name: 'disconnect_discord'})">Disconnect Integration</x-button>
                    </div>
                    <div class="md:space-x-2 flex flex-col md:items-center md:flex-row space-y-2 md:space-y-0">
                        <x-button @click="$dispatch('modal', {name: 'discord_reference'})" class="justify-center" role="secondary" >Command Reference</x-button>
                        <x-button-link class="justify-center" role="primary" :href="route('discord.auth.admin')">Add FC to a server</x-button-link>
                    </div>

                    <x-modal name="disconnect_discord"
                             icon="exclamation-triangle"
                             icon-color="red"
                             title="Are you sure?"
                             body="Your Discord account will be disconnected from Fantasy Calendar. Commands will no longer work for you, but you will still need to remove the app from any servers you don't want it in in order to remove it completely."
                             affirmative-color="red"
                             affirmative-label="Yep, disconnect my account."
                    ></x-modal>

                    <x-modal name="discord_reference"
                             icon="question">
                        <div class="px-4 py-5 sm:px-6">
                            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">Discord Command Information</h3>
                            <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Commands names and details</p>
                        </div>
                        <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
                            <dl class="text-left sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700">
                                @foreach(discord_help() as $command)
                                    <div class="py-4 sm:py-5 sm:px-6">
                                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $command['command'] }}</dt>
                                        <dd class="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">{{ $command['description'] }}</dd>
                                    </div>
                                @endforeach
                            </dl>
                        </div>

                        <x-slot name="buttons">
                            <x-button @click="show = false;" type="button" class="col-span-2 mt-3 w-full inline-flex justify-center rounded-md border border-primary-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-primary-700 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                                Ok
                            </x-button>
                        </x-slot>
                    </x-modal>
                </div>
            </x-slot>
        @elseif(auth()->user()->isPremium())
            <div class="flex flex-col space-y-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden mr-3 bg-white dark:bg-gray-500 border-2 border-gray-400 dark:border-gray-500 flex items-center justify-center">
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
                <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 text-right sm:px-6 flex flex-col md:flex-row justify-end md:space-x-2 space-y-2 md:space-y-0">
                    <x-button class="justify-center" role="secondary" @click="$dispatch('modal', { name: 'discord_explanation'})">What information does FC get?</x-button>
                    <x-button-link class="justify-center" href="{{ route('discord.auth.user') }}">Connect your Discord account</x-button-link>
                </div>

                <x-modal name="discord_explanation"
                         icon="question"
                >
                    <div class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-50 mb-4">
                        What information does Fantasy Calendar get from Discord?
                    </div>

                    <div class="prose dark:prose-invert">
                        <table class="table">
                            <thead>
                            <tr>
                                <th scope="col" class="whitespace-nowrap">Permission</th>
                                <th scope="col">How we use it</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th scope="row" class="whitespace-nowrap pr-2">Your email</th>
                                <td>Used for any notifications about this integration</td>
                            </tr>
                            <tr>
                                <th scope="row" class="whitespace-nowrap pr-2">Discord ID</th>
                                <td>Used to associate your Discord account with your Fantasy Calendar account, for permissions</td>
                            </tr>
                            <tr>
                                <th scope="row" class="whitespace-nowrap pr-2">List of server IDs you're in</th>
                                <td>Required by Discord to create commands in servers you own</td>
                            </tr>
                            <tr>
                                <th scope="row" class="whitespace-nowrap pr-2">Application command creation</th>
                                <td>Lets us create slash-commands in servers you're in</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <x-slot name="buttons">
                        <x-button @click="show = false;" type="button" class="col-span-2 mt-3 w-full inline-flex justify-center rounded-md border border-primary-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-primary-700 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                            Ok
                        </x-button>
                    </x-slot>
                </x-modal>
            </x-slot>
        @else
            <div class="flex items-cetnter">
                <div class="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden mr-3 bg-white dark:bg-gray-500 border-2 border-gray-400 dark:border-gray-500 flex items-center justify-center">
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

    <template x-teleport="body">
        <x-slide-over model="openDiscordWebhooksSidebar">
            <x-slot name="title">Discord webhooks</x-slot>

            <x-slot name="description">
                Manage webhooks you've setup for sending information to Discord
            </x-slot>

            <x-slot name="footer">
                <x-button role="secondary" @click="openDiscordWebhooksSidebar = false">Close</x-button>
            </x-slot>

            <nav class="h-full rounded overflow-y-auto" aria-label="Webhooks list" x-data="WebhooksList()" @modal-ok.window="modal_ok">
                @foreach(auth()->user()->calendars()->whereHas('discord_webhooks')->with('discord_webhooks')->get() as $calendar)
                    <div class="relative">
                        <div class="z-10 sticky top-0 border-t border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 px-6 py-1 text-sm font-medium text-gray-500 dark:text-gray-300">
                            <h3>{{ $calendar->name }}</h3>
                        </div>
                        <ul role="list" class="relative z-0 divide-y divide-gray-200 dark:divide-gray-600">
                            @foreach($calendar->discord_webhooks as $webhook)
                                <li class="bg-white relative dark:bg-gray-700" x-data="{ name: `{{ $webhook->name }}`, active: {{ $webhook->active ? 'true' : 'false' }} }">
                                    <div class="px-5 pt-5 flex items-center">
                                        <div class="flex-shrink-0 pr-2" x-show="expanded === {{ $webhook->id }}">
                                            <i class="fa fa-trash text-red-400 dark:text-red-600 hover:text-red-600 dark:hover:text-red-400 hover:cursor-pointer"
                                               title="Delete this webhook"
                                               @click="$dispatch('modal', {
                                                    name: 'delete_webhook_confirmation',
                                                    title: 'Are you sure?',
                                                    body: 'Are you sure you want to delete <strong>{{ addslashes($webhook->name) }}</strong>?',
                                                    ok_event: { url: '{{ route('discord.webhooks.delete', ['discordWebhook' => $webhook]) }}' },
                                                })"
                                            ></i>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <x-text-input x-model="name" x-show="expanded === {{ $webhook->id }}"></x-text-input>
                                            <p class="text-sm font-medium dark:text-gray-200 text-gray-900" x-text="name" x-show="expanded !== {{ $webhook->id }}"></p>
                                        </div>
                                        <div class="flex-shrink-0 pl-2" x-show="expanded !== {{ $webhook->id }}">
                                            <i @click="expanded = {{ $webhook->id }}" class="fa fa-pencil-alt text-primary-600 dark:text-primary-700 hover:text-primary-400 dark:hover:text-primary-500 hover:cursor-pointer" title="Edit this webhook"></i>
                                        </div>
                                    </div>

                                    <div class="px-5 pb-1.5" x-show="expanded === {{ $webhook->id }}">
                                        <p class="text-xs pt-1 text-gray-500 dark:text-gray-400 truncate">Created {{ $webhook->created_at->format('Y-m-d') }}</p>
                                    </div>

                                    <div class="px-5 pb-5">
                                        <div x-show="expanded === {{ $webhook->id }}" class="pt-4">
                                            <x-input-toggle x-model="active" name="active" id="active" label="Enabled" value="{{ $webhook->active ? 'true' : 'false' }}"></x-input-toggle>
                                        </div>
                                    </div>

                                    <div class="flex justify-end px-5 pb-2 space-x-2" x-show="expanded === {{ $webhook->id }}">
                                        <x-button role="secondary"
                                                  @click="expanded = -1"
                                        >
                                            <i class="fa fa-times pr-1.5"></i> Cancel
                                        </x-button>
                                        <x-button role="primary"
                                                  @click="update_webhook('{{ route('discord.webhooks.update', ['discordWebhook' => $webhook]) }}', { name, active }); expanded = -1;"
                                        >
                                            <i class="fa fa-save pr-1.5"></i> Save
                                        </x-button>
                                    </div>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                @endforeach

                <x-modal name="delete_webhook_confirmation"
                         icon="exclamation-triangle"
                         icon-color="red"
                         affirmative-color="red"
                         affirmative-label="Yep, delete it."
                         noteleport
                ></x-modal>

                <x-modal name="delete_webhook_confirm" title="Webhook deleted" noteleport></x-modal>
                <x-modal name="delete_error" noteleport></x-modal>
            </nav>
        </x-slide-over>
    </template>
</x-panel>
