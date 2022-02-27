@push('head')
    <script>
        CalendarList = function () {
            return {
                modal_ok($event) {
                    switch($event.detail.name) {
                        case 'delete_confirmation':
                            this.delete_calendar($event.detail.hash);
                            break;
                        case 'copy_confirmation':
                            this.copy_calendar($event.detail.hash);
                            break;
                        case 'delete_confirm':
                            location.reload();
                            break;
                    }
                },
                delete_calendar(hash) {
                    axios
                        .delete('/api/calendar/' + hash)
                        .then(results => {
                            if(results.data.error) {
                                throw "Error: " + results.data.message;
                            }

                            this.dispatch('modal', {
                                name: 'delete_confirm',
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

<x-app-layout>
    <div class="flex flex-col mx-auto"
         x-data="CalendarList()"
         @modal-ok.window="modal_ok"
    >

        @if(session()->has('alert-warning'))
            <x-alert type="warning">{{ session('alert-warning') }}</x-alert>
        @endif

        @if(!auth()->user()->acknowledged_discord_announcement)
            <x-alert type="notice" icon="fab fa-discord" class="relative mb-4">
                <a href="{{ route('discord-announcement-acknowledge') }}" class="alert-link" style="float: right;"><i class="fa fa-times"></i></a>
                <h4 class="font-semibold">Fantasy Calendar integrates with Discord!</h4>

                @if(!auth()->user()->isPremium())
                    <div>All the information about this subscriber feature (<a class="font-semibold underline hover:text-blue-500 dark:hover:text-white" href="{{ route('subscription.pricing') }}">only $2.49/month!</a>) can be found <a class="font-semibold underline hover:text-blue-500 dark:hover:text-white" href="{{ route('discord') }}">on this page</a>!</div>
                @else
                    <div>All the information can be found <a class="font-semibold underline hover:text-blue-500 dark:hover:text-white" href="{{ route('discord') }}">on this page</a> - as a subscriber, you have immediate <a class="font-semibold underline hover:text-blue-500 dark:hover:text-white" href="{{ route('discord.index') }}">access</a>!</div>
                @endif
            </x-alert>
        @endif

        @foreach($invitations as $invitation)
            <x-alert type="success" icon="" class="mb-10">
                <div class="flex flex-col md:flex-row justify-between md:items-center">
                    <div class="py-2 -ml-2"><i class="fa fa-envelope-open-text pr-2 w-6 text-md"></i> You've been invited to '{{ $invitation->calendar->name }}' created by '{{ $invitation->calendar->user->username }}'.</div>
                    <hr class="md:hidden mb-2 border-green-100 dark:border-green-700">
                    <div class="text-right space-x-2">
                        <x-button-link custom-role="text-red-500 dark:text-gray-200 focus:ring-red-500 hover:text-white dark:hover:text-white dark:hover:bg-red-900 hover:bg-red-600 border-0 focus:border-0 shadow-none" href="{{ route('invite.reject-confirm', ['token' => $invitation->invite_token]) }}">Reject <span class="hidden md:inline-block md:ml-1">invitation</span></x-button-link>
                        <x-button-link custom-role="text-white bg-primary-600 disabled:hover:bg-primary-600 hover:bg-primary-700 dark:bg-primary-800 disabled:dark:hover:bg-primary-900 dark:hover:bg-primary-700 focus:ring-primary-500 border-transparent shadow-sm" href="{{ route('invite.accept', ['token' => $invitation->invite_token]) }}">Accept <span class="hidden md:inline-block md:ml-1">invitation</span></x-button-link>
                    </div>
                </div>
            </x-alert>
        @endforeach

        @if(count($calendars) == 0 && !$search)
            @if(count($shared_calendars))
                    <div class="text-center flex-col sm:flex-row flex-grow border border-gray-300 dark:border-gray-700 rounded-md p-6 flex justify-between sm:space-x-4">
                        <div class="flex space-x-2 items-center justify-start text-left">
                            <div>
                                <svg class="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                    <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 5V1M14 5V1M6 11H10M14 11H10M10 11V7V15M3 19H17C18.1046 19 19 18.1046 19 17V5C19 3.89543 18.1046 3 17 3H3C1.89543 3 1 3.89543 1 5V17C1 18.1046 1.89543 19 3 19Z"/>
                                </svg>
                            </div>

                            <div>
                                <h3 class="text-sm font-medium text-gray-900 dark:text-gray-200">You don't have any calendars of your own.</h3>
                                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">If you'd like to change that, creating a new one is the easiest way to get started.</p>
                            </div>
                        </div>
                        <div class="flex items-center w-full sm:w-auto mt-4 sm:mt-0">
                            <x-button role="secondary" class="w-full justify-center whitespace-nowrap">
                                <!-- Heroicon name: solid/plus -->
                                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                                </svg>
                                New calendar
                            </x-button>
                        </div>
                    </div>
            @else
                    <div class="text-center flex-grow py-20 sm:border border-gray-300 dark:border-gray-700 rounded-md">
                        <svg class="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                            <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 5V1M14 5V1M6 11H10M14 11H10M10 11V7V15M3 19H17C18.1046 19 19 18.1046 19 17V5C19 3.89543 18.1046 3 17 3H3C1.89543 3 1 3.89543 1 5V17C1 18.1046 1.89543 19 3 19Z"/>
                        </svg>

                        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">You don't have any calendars yet!</h3>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Getting started is easy, create one to start tracking your story in just a few minutes.</p>
                        <div class="mt-6">
                            <x-button>
                                <!-- Heroicon name: solid/plus -->
                                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                                </svg>
                                New calendar
                            </x-button>
                        </div>
                    </div>
            @endif
        @endif

        @if(count($calendars) > 0 && !$search)
            <div class="flex items-center justify-between w-full mb-4">
                <h1 class="text-gray-900 dark:text-gray-200 text-xl">My Calendars</h1>

                <x-button-link role="primary" href="{{ route('calendars.create') }}"><i class="fa fa-plus mr-2"></i> Create New</x-button-link>
            </div>
        @endif

        @if($calendars->hasPages() || $search)
            <div class="flex flex-col md:flex-row justify-between mb-4">
                <form action="{{ route('calendars.index') }}" class="md:w-80 md:max-w-full mb-4 md:mb-0" method="get" x-data="{ search: `{{ $search }}` }" x-ref="searchform">
                    @csrf
                    <div class="relative">
                        <x-text-input x-ref="searchbox" x-model="search" name="search" placeholder="Search..." value="{{ $search ?? '' }}"></x-text-input>
                        <div class="absolute inset-y-0 right-0 flex items-center justify-center">
                            <span class="h-full inline-flex items-center px-2 text-sm font-sans font-medium text-gray-400" x-show="!search" @click="$refs.searchbox.focus()">
                                <i class="fa fa-search"></i>
                            </span>

                            <button type="button" @click="search = ''; $nextTick(() => $refs.searchform.submit())" class="cursor-pointer h-full inline-flex items-center px-2 text-sm font-sans font-medium text-gray-400" x-cloak x-show="search">
                                <i class="fa fa-times"></i>
                            </button>
                        </div>
                    </div>
                </form>

                <div>{{ $calendars->onEachSide(1)->links() }}</div>
            </div>
        @endif

        @if(!count($shared_calendars) && !count($calendars) && $search)
            <h2 class="text-center border border-gray-300 dark:border-gray-700 rounded py-4 h-32 grid place-items-center">No calendars match '{{ $search }}'</h2>
        @endif

        @if(count($calendars) > 0 || count($shared_calendars) > 0)
            <!-- This example requires Tailwind CSS v2.0+ -->
            <div class="bg-white dark:bg-gray-800 shadow sm:rounded-md">
                <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
                    @foreach($calendars as $index => $calendar)
                        <li class="relative flex items-center">
                            <a href="{{ route('calendars.show', ['calendar'=> $calendar->hash]) }}" class="block flex-grow hover:bg-gray-50 dark:hover:bg-gray-700">
                                <div class="flex items-center px-4 py-4 sm:px-6">
                                    <div class="min-w-0 flex-1 md:grid md:grid-cols-3 md:gap-4">
                                        <div>
                                            <p class="text-md font-medium text-primary-700 dark:text-primary-500 pr-24">{{ $calendar->name }}</p>
                                            <p class="mt-2 flex items-center text-md text-gray-500 dark:text-gray-400">
                                                <!-- Heroicon name: solid/user-circle -->
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-8 flex-shrink-0 md:mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                                                </svg>
                                                <span class="truncate">
                                                    {{ $calendar->user->username }}
                                                    @if($calendar->users_count)
                                                        <i class="fa fa-user pl-4"></i> {{ $calendar->users_count }}
                                                    @endif
                                                </span>
                                            </p>
                                        </div>
                                        <div class="flex-grow">
                                            <div class="flex text-md text-gray-600 dark:text-gray-400 pt-1 md:pt-0">
                                                <i class="flex-shrink-0 pt-1 text-gray-400 w-8 text-center fa fa-calendar"></i> <div>{{ $calendar->current_date }}</div>
                                            </div>
                                            @if($calendar->current_era_valid)
                                                <div class="flex text-md text-gray-600 dark:text-gray-400 pt-1 md:pt-0">
                                                    <i class="flex-shrink-0 pt-1 text-gray-400 w-8 text-center fa fa-infinity"></i> <div>{{ $calendar->current_era }}</div>
                                                </div>
                                            @endif
                                        </div>
                                        <div class="text-gray-900 dark:text-gray-400 text-md">
                                            @if($calendar->clock_enabled)
                                                <div class="flex text-md text-gray-600 dark:text-gray-400 pt-1 md:pt-0">
                                                    <i class="flex-shrink-0 pt-1 text-gray-400 w-8 text-center fa fa-clock"></i> <div>{{ $calendar->current_time }}</div>
                                                </div>
                                            @endif
                                            <div class="flex text-md text-gray-600 dark:text-gray-400 pt-1 md:pt-0">
                                                <i class="flex-shrink-0 pt-1 w-8 text-center fa fa-calendar-alt"></i> <div>{{ $calendar->events_count }} {{ \Illuminate\Support\Str::plural('Event', $calendar->events_count) }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>

                            <div class="absolute top-4 md:top-auto right-16">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>

                            <div class="absolute top-4 md:top-auto right-4" x-data="{open: false}" @click.prevent @click.outside="open = false">
                                <div class="h-full flex items-center">
                                    <button @click="open = ! open" type="button" class="flex rounded-full dark:text-gray-400 items-center text-gray-400 hover:text-gray-600 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-700 focus:ring-primary-500" id="menu-button" aria-expanded="true" aria-haspopup="true">
                                        <span class="sr-only">Open options</span>
                                        <!-- Heroicon name: solid/dots-vertical -->
                                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </button>
                                </div>

                                <div class="origin-top-right absolute z-20 right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-200 dark:divide-gray-800"
                                     role="menu"
                                     aria-orientation="vertical"
                                     aria-labelledby="menu-button"
                                     tabindex="-1"
                                     x-transition:enter="transition ease-out duration-100"
                                     x-transition:enter-start="transform opacity-0 scale-95"
                                     x-transition:enter-end="transform opacity-100 scale-100"
                                     x-transition:leave="transition ease-in duration-75"
                                     x-transition:leave-start="transform opacity-100 scale-100"
                                     x-transition:leave-end="transform opacity-0 scale-95"
                                     x-show="open"
                                     x-cloak
                                >
                                    <div class="py-1" role="none">
                                        <a class="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 block px-4 py-2 text-md" href='{{ route('calendars.edit', ['calendar'=> $calendar->hash ]) }}' role="menuitem" tabindex="-1">
                                            <i class="fa fa-edit"></i> Edit
                                        </a>
                                        <a class="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 block px-4 py-2 text-md" href='{{ route('calendars.show', ['calendar'=> $calendar->hash ]) }}' role="menuitem" tabindex="-1">
                                            <i class="fa fa-eye"></i> View
                                        </a>
                                        <span class="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 block px-4 py-2 text-md" href="javascript:" data-hash="{{ $calendar->hash }}" data-name="{{ $calendar->name }}" role="menuitem">
                                            <i class="fa fa-copy"></i> Copy
                                        </span>
                                    </div>
                                    <div class="py-1" role="none">
                                        <a class="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 block px-4 py-2 text-md" href="{{ route('calendars.guided_embed', ['calendar' => $calendar->hash]) }}" role="menuitem" tabindex="-1">
                                            <i class="fa fa-share-square"></i> Embed
                                        </a>
                                        <a class="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 block px-4 py-2 text-md" href="{{ route('calendars.show', ['calendar' => $calendar->hash, 'print' => 1]) }}"  >
                                            <i class="fa fa-print"></i> Print
                                        </a>
                                        <a class="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 block px-4 py-2 text-md" href="{{ route('calendars.export', ['calendar' => $calendar->hash]) }}"  >
                                            <i class="fa fa-file-export"></i> Export
                                        </a>
                                    </div>
                                    <div class="py-1">
                                        <span class="cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-800 block px-4 py-2 text-md" href="javascript:" data-hash="{{ $calendar->hash }}" data-name="{{ $calendar->name }}"
                                              @click="$dispatch('modal', {
                                                    name: 'delete_confirmation',
                                                    title: 'Are you sure?',
                                                    body: 'Are you sure you want to delete <strong>{{ $calendar->name }}</strong>?',
                                                    ok_event: { hash: '{{ $calendar->hash }}' },
                                                })">
                                            <i class="fa fa-calendar-times"></i> Delete
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    @endforeach
                </ul>
            </div>

            @if(count($shared_calendars))
                <div class="flex flex-col md:flex-row justify-between items-center mt-8 mb-4">
                    <h1 class="text-gray-900 dark:text-gray-200 text-xl mb-2 md:mb-0">Calendars shared with me</h1>

                    @if($shared_calendars->hasPages())
                        <div class="">{{ $shared_calendars->onEachSide(1)->links() }}</div>
                    @endif
                </div>

                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-md mb-8">
                    <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
                        @foreach($shared_calendars as $index => $calendar)
                            <li class="relative flex items-center">
                                <a href="{{ route('calendars.show', ['calendar'=> $calendar->hash]) }}" class="block flex-grow hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <div class="flex items-center px-4 py-4 sm:px-6">
                                        <div class="min-w-0 flex-1 md:grid md:grid-cols-3 md:gap-4">
                                            <div>
                                                <p class="text-md font-medium text-primary-700 dark:text-primary-500 truncate">{{ $calendar->name }}</p>
                                                <p class="mt-2 flex items-center text-md text-gray-500 dark:text-gray-400">
                                                    <!-- Heroicon name: solid/user-circle -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-8 flex-shrink-0 mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                                                    </svg>
                                                    <span class="truncate">
                                                    {{ $calendar->user->username }}
                                                        @if($calendar->users_count)
                                                            <i class="fa fa-user"></i> {{ $calendar->users_count }}
                                                        @endif
                                                </span>
                                                </p>
                                            </div>
                                            <div class="hidden md:block flex-grow">
                                                <div class="flex text-md text-gray-600 dark:text-gray-400 relative">
                                                    <i class="flex-shrink-0 pt-1 text-gray-400 w-8 text-center fa fa-calendar"></i> <div>{{ $calendar->current_date }}</div>
                                                </div>
                                                @if($calendar->current_era_valid)
                                                    <div class="flex text-md text-gray-600 dark:text-gray-400 relative">
                                                        <i class="flex-shrink-0 pt-1 text-gray-400 w-8 text-center fa fa-infinity"></i> <div>{{ $calendar->current_era }}</div>
                                                    </div>
                                                @endif
                                            </div>
                                            <div class="text-gray-900 dark:text-gray-400 text-md">
                                                @if($calendar->clock_enabled)
                                                    <div class="flex text-md text-gray-600 dark:text-gray-400 relative">
                                                        <i class="flex-shrink-0 pt-1 text-gray-400 w-8 text-center fa fa-clock"></i> <div>{{ $calendar->current_time }}</div>
                                                    </div>
                                                @endif
                                                <div class="flex text-md text-gray-600 dark:text-gray-400 relative">
                                                    <i class="flex-shrink-0 pt-1 w-8 text-center fa fa-calendar-alt"></i> <div>{{ $calendar->events_count }} {{ \Illuminate\Support\Str::plural('Event', $calendar->events_count) }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </div>
            @endif
        @endif

        <x-modal name="delete_confirmation"
                 icon="exclamation-triangle"
                 icon-color="red"
                 affirmative-color="red"
                 affirmative-label="Yep, delete it."
        ></x-modal>

        <x-modal name="delete_confirm" title="Calendar deleted"></x-modal>
        <x-modal name="delete_error"></x-modal>

        <x-modal name="copy_confirmation"></x-modal>
    </div>
</x-app-layout>
