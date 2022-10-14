@push('head')
    <script>
        function apiTokens() {
            return {
                deleting: '',
                plain_text_token: '',

                modal_ok($event) {
                    switch($event.detail.name) {
                        case 'delete_confirmation':
                            this.delete_confirmation($event);
                            break;
                        case 'create_token':
                            this.create_token($event);
                            break;
                        case 'token_created':
                            this.token_created();
                            break;
                    }
                },
                token_created() {
                    this.plain_text_token = '';
                    location.reload();
                },
                create_token($event) {
                    axios.post('{{ route('profile.api-tokens.create') }}', {
                        name: $event.detail.form_info.name
                    })
                        .then((response) => {
                            this.plain_text_token = response.data.plain_text_token;

                            this.dispatch('modal', {
                                name: 'token_created'
                            });
                        })
                        .catch((error) => {
                            this.dispatch('notify', {
                                title: 'Oops!',
                                body: 'An error occurred, please try again later.',
                                icon: 'fa-exclamation-triangle',
                                icon_color: 'text-red-500'
                            })
                        })
                },
                delete_confirmation($event) {
                    axios.delete($event.detail.delete_url)
                        .then((response) => {
                            location.reload();
                        })
                        .catch((error) => {
                            this.dispatch('notify', {
                                title: 'Oops!',
                                body: 'An error occurred, please try again later.',
                                icon: 'fa-exclamation-triangle',
                                icon_color: 'text-red-500'
                            })
                        })
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

<x-profile-layout>
    <x-panel :fullwidth="true" x-data="apiTokens()"
     @modal-ok.window="modal_ok"
    >
        <h2 id="api-tokens-heading" class="px-6 pt-6 text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">Access Tokens</h2>

        @if(auth()->user()->tokens()->count())
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Created</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Name</th>
                    <!--
                      `relative` is added here due to a weird bug in Safari that causes `sr-only` headings to introduce overflow on the body on mobile.
                    -->
                    <th scope="col" class="relative px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                        <span class="sr-only">Delete</span>
                    </th>
                </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                @foreach(auth()->user()->tokens as $token)
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                            {{ $token->created_at->format('M d, Y') }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200 truncate">{{ $token->name }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <span @click="deleting = `{{ $token->name }}`; $dispatch('modal', { name: 'delete_confirmation', ok_event: {delete_url: `{{ route('profile.api-tokens.delete', ['personalAccessToken' => $token->id]) }}`} })" class="text-primary-600 hover:text-primary-900 cursor-pointer">Delete token</span>
                        </td>
                    </tr>
                @endforeach

                <tr>
                    <td colspan="3" class="px-6 py-4">
                        <x-button @click="$dispatch('modal', { name: 'create_token' })" role="secondary" class="w-full justify-center"><i class="fa fa-plus mr-1"></i> Create New API Token</x-button>
                    </td>
                </tr>
                </tbody>
            </table>
        @else
            <div class="p-6">
                <button @click="$dispatch('modal', { name: 'create_token' })" type="button" class="relative group block w-full border-2 border-gray-400 border-dashed dark:border-gray-600 dark:hover:border-gray-500 rounded-lg p-6 text-center hover:border-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="group-hover:text-gray-500 dark:group-hover:text-gray-400 mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <span class="mt-2 block text-sm font-medium text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"> Create an access token </span>
                </button>
            </div>
        @endif

        <x-modal name="token_created"
                 title="Token created!"
                 body="Your token has been created, and this is the only time we'll show it to you! Copy it wherever you need it before closing this dialog.<br><br><pre class='bg-gray-900 rounded leading-8 min-w-full text-gray-200 font-mono overflow-x-auto'><code x-html='plain_text_token'></code></pre>"
        ></x-modal>

        <x-modal name="create_token"
                 icon="key"
        >
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-50 mb-2">Create an access token</h3>

            <x-slot name="form">
                <x-text-input required x-model="form_info.name" name="name" label="New access token name" placeholder="My excellent API application"></x-text-input>
            </x-slot>
        </x-modal>

        <x-modal name="delete_confirmation"
                 icon="exclamation-triangle"
                 icon-color="red"
                 title="Are you sure?"
                 body="The token <span class='font-bold' x-text='deleting'></span> will be irrevocably deleted and will no longer work. Anything currently using it will need to be provided with a new token."
                 affirmative-color="red"
                 affirmative-label="Yep, delete it."
        ></x-modal>
    </x-panel>
</x-profile-layout>
