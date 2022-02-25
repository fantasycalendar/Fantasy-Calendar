<x-app-layout>
    <div class="flex flex-col">

        @if(session()->has('alert-warning'))
            <x-alert type="warning">{{ session('alert-warning') }}</x-alert>
        @endif

        @if(!auth()->user()->acknowledged_discord_announcement)
            <x-alert type="notice" icon="fab fa-discord" class="relative mb-4">
                <a href="{{ route('discord-announcement-acknowledge') }}" class="alert-link" style="float: right;"><i class="fa fa-times"></i></a>
                <h4 class="font-semibold">Fantasy Calendar integrates with Discord!</h4>

                @if(!auth()->user()->isPremium())
                    <div>All the information about this subscriber feature (<a class="font-semibold underline hover:text-white" href="{{ route('subscription.pricing') }}">only $2.49/month!</a>) can be found <a class="font-semibold underline hover:text-white" href="{{ route('discord') }}">on this page</a>!</div>
                @else
                    <div>All the information can be found <a class="font-semibold underline hover:text-white" href="{{ route('discord') }}">on this page</a> - as a subscriber, you have immediate <a class="font-semibold underline hover:text-white" href="{{ route('discord.index') }}">access</a>!</div>
                @endif
            </x-alert>
        @endif

        @if(count($invitations))
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
        @endif

        @if(count($calendars) == 0 && !$search)
            <div class="text-center flex-grow mt-24">
                <svg class="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 5V1M14 5V1M6 11H10M14 11H10M10 11V7V15M3 19H17C18.1046 19 19 18.1046 19 17V5C19 3.89543 18.1046 3 17 3H3C1.89543 3 1 3.89543 1 5V17C1 18.1046 1.89543 19 3 19Z"/>
                </svg>

                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No calendars</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new one.</p>
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

        @if($calendars->hasPages() || $search)
            <div class="flex flex-col md:flex-row justify-between">
                <form action="{{ route('calendars.index') }}" class="calendar-search" method="get">
                    @csrf
                    <div class="form-group input-group">
                        <input type="text" class="form-control calendar-search-input" name="search" placeholder="Search..." @if($search) value="{{ $search }}" @endif>
                        <span class='search-clear'><i class="fa fa-times"></i></span>
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary">
                                <i class="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                </form>

                <span class="hidden md:block">{{ $calendars->onEachSide(1)->links() }}</span><span class="block md:hidden">{{ $calendar_pagination->links() }}</span>
            </div>
        @endif

        @if(!count($shared_calendars) && !count($calendars) && $search)
            <h2 class="text-center border py-4" style="opacity: 0.7;">No calendars match '{{ $search }}'</h2>
        @endif

        @if(count($calendars) > 0 || count($shared_calendars) > 0)

            @if(count($calendars) > 0 && !$search)
                <div class="flex items-center justify-between w-full">
                    <h1 class="text-gray-900 dark:text-gray-200 text-xl">My Calendars</h1>

                    <x-button-link role="primary" href="{{ route('calendars.create') }}"><i class="fa fa-plus"></i> Create New</x-button-link>
                </div>
            @endif

            @foreach($calendars as $index => $calendar)

                <div class="row border-top py-3 calendar-entry list-group-item-action w-auto @if($calendar->disabled) calendar-disabled protip @endif" @if($calendar->disabled) data-pt-title="Free accounts are limited to two calendars. You'll need to re-subscribe to use this one." @endif>
                    <div class="col-6 col-md-4 col-lg-5">
                        <a href="{{ route('calendars.show', ['calendar'=> $calendar->hash]) }}"><h4 class="calendar-name">{{ $calendar->name }} <br><span class="creator_name">{{ $calendar->user->username }}</span></h4></a>
                    </div>
                    <div style="padding-left: 33px;" class="hidden md:block col-md-4 col-lg-3">
                        <i class="fa fa-calendar" style="margin-left: -20px;"></i> {{ $calendar->current_date }} <br>
                        @if($calendar->clock_enabled)
                            <i class="fa fa-clock" style="margin-left: -20px;"></i> {{ $calendar->current_time }} <br>
                        @endif
                        @if($calendar->current_era_valid)
                            <i class="fa fa-infinity" style="margin-left: -20px;"></i> {{ $calendar->current_era }}
                        @endif
                    </div>
                    <div class="hidden d-lg-block col-lg-1 protip">
                        <i class="fa fa-calendar-check"></i> {{ $calendar->events_count }} <br>
                        @if($calendar->users_count)
                            <i class="fa fa-user"></i> {{ $calendar->users_count }}
                        @endif
                    </div>
                    <div class="col-6 col-md-4 col-lg-3 text-right">
                        <div class="btn-group">
                            <a class='calendar_action btn btn-outline-secondary action-edit protip' data-pt-delay-in="500" data-pt-title="Edit '{{ $calendar->name }}'" href='{{ route('calendars.edit', ['calendar'=> $calendar->hash ]) }}'>
                                <i class="fa fa-edit"></i> <span class="hidden md:inline">Edit</span>
                            </a>
                            <a class='calendar_action btn btn-outline-secondary action-show protip' data-pt-delay-in="500" data-pt-title="View '{{ $calendar->name }}'" href='{{ route('calendars.show', ['calendar'=> $calendar->hash ]) }}'>
                                <i class="fa fa-eye"></i> <span class="hidden md:inline">View</span>
                            </a>

                            <button class="calendar_action btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" type="button" id="dropdownButton-{{ $calendar->hash }}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                            <div class="calendar_action dropdown-menu dropdown-menu-right" aria-labelledby="dropdownButton-{{ $calendar->hash }}">
                                <a class='dropdown-item action-edit protip md:hidden' data-pt-delay-in="500" data-pt-title="Edit '{{ $calendar->name }}'" href='{{ route('calendars.edit', ['calendar'=> $calendar->hash ]) }}'>
                                    <i class="fa fa-edit"></i> Edit
                                </a>
                                <a class='dropdown-item action-show protip md:hidden' data-pt-delay-in="500" data-pt-title="View '{{ $calendar->name }}'" href='{{ route('calendars.show', ['calendar'=> $calendar->hash ]) }}'>
                                    <i class="fa fa-eye"></i> View
                                </a>
                                <a class="dropdown-item copy_button action-copy protip" data-pt-delay-in="500" data-pt-title="Copy '{{ $calendar->name }}'" href="javascript:" data-hash="{{ $calendar->hash }}" data-name="{{ $calendar->name }}">
                                    <i class="fa fa-copy"></i> Copy
                                </a>

                                <div class="dropdown-divider"></div>

                                <a class="dropdown-item action-export protip" data-pt-delay-in="500" data-pt-title="Embed '{{ $calendar->name }}'" href="{{ route('calendars.guided_embed', ['calendar' => $calendar->hash]) }}">
                                    <i class="fa fa-share-square"></i> Embed
                                </a>
                                <a class="dropdown-item action-print protip" data-pt-delay-in="500" data-pt-title="Print '{{ $calendar->name }}'" href="{{ route('calendars.show', ['calendar' => $calendar->hash, 'print' => 1]) }}" >
                                    <i class="fa fa-print"></i> Print
                                </a>
                                <a class="dropdown-item action-export protip" data-pt-delay-in="500" data-pt-title="Export '{{ $calendar->name }}'" href="{{ route('calendars.export', ['calendar' => $calendar->hash]) }}" >
                                    <i class="fa fa-file-export"></i> Export
                                </a>

                                <div class="dropdown-divider"></div>

                                <a class="dropdown-item delete_button action-delete protip" data-pt-delay-in="500" data-pt-title="Delete '{{ $calendar->name }}'" href="javascript:" data-hash="{{ $calendar->hash }}" data-name="{{ $calendar->name }}">
                                    <i class="fa fa-calendar-times"></i> Delete
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach

            @if(count($shared_calendars))
                <div class="row flex justify-content-end pt-3"><span class="hidden md:block">{{ $calendars->onEachSide(1)->links() }}</span><span class="block md:hidden">{{ $calendar_pagination->links() }}</span></div>
                <h2>Calendars shared with me</h2>

                @foreach($shared_calendars as $index => $calendar)
                    <div class="row border-top py-3 calendar-entry list-group-item-action w-auto">
                        <div class="col-6 col-md-4 col-lg-5">
                            <a href="{{ route('calendars.show', ['calendar'=> $calendar->hash]) }}"><h4 class="calendar-name">{{ $calendar->name }} <small class="badge badge-secondary" style="font-size: 44%; position: relative; top: -4px; margin-left: 4px;">{{ $calendar->pivot->user_role }}</small> <br><span class="creator_name">{{ $calendar->user->username }}</span></h4></a>
                        </div>
                        <div style="padding-left: 33px;" class="hidden md:block col-md-4 col-lg-3">
                            <i class="fa fa-calendar" style="margin-left: -20px;"></i> {{ $calendar->current_date }} <br>
                            @if($calendar->clock_enabled)
                                <i class="fa fa-clock" style="margin-left: -20px;"></i> {{ $calendar->current_time }}
                            @endif
                        </div>
                        <div class="hidden d-lg-block col-lg-1 protip">
                        <span class="protip" data-pt-delay-in="200" data-pt-title="{{ $calendar->name }} has {{ $calendar->events_count }} events.">
                            <i class="fa fa-calendar-check"></i> {{ $calendar->events_count }}
                        </span>
                        </div>
                        <div class="col-6 col-md-4 col-lg-3 text-right">
                            <div class="btn-group">
                                <a class='calendar_action btn btn-outline-secondary action-show protip' data-pt-delay-in="500" data-pt-title="View '{{ $calendar->name }}'" href='{{ route('calendars.show', ['calendar'=> $calendar->hash ]) }}'>
                                    <i class="fa fa-eye"></i> <span class="hidden md:inline">View</span>
                                </a>
                            </div>
                        </div>
                    </div>
                @endforeach
            @endif
        @endif
    </div>
</x-app-layout>
