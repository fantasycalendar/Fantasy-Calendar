@extends('templates._page')

@push('head')
    <script>
        $(document).ready(function() {
            if($('.calendar-search-input').length && $('.calendar-search-input').val().length == 0) {
                $('.search-clear').addClass('d-none');
            }

            $('.delete_button').click(function() {
                let calendar_hash = $(this).attr('data-hash');
                let calendar_name = $(this).attr('data-name');

                delete_calendar(calendar_hash, calendar_name, function() {location.reload();});
            });

            $('.copy_button').click(function() {
                let calendar_hash = $(this).attr('data-hash');
                let calendar_name = $(this).attr('data-name');

                copy_calendar(calendar_hash, calendar_name, function() {location.reload();});
            });

            $('.calendar-search-input').keyup(function(){
                $('.search-clear').toggleClass('d-none', $(this).val().length == 0);
            })

            $('.search-clear').click(function() {
                $('.calendar-search-input').val('');
                $('.search-clear').addClass('d-none');

                let searchParams = new URLSearchParams(window.location.search);

                if(searchParams.has('search') && searchParams.get('search').length > 0) {
                    $('.calendar-search').submit();
                }
            });
        });
    </script>
@endpush


@section('content')
    <div class="container py-5">

        @if(session()->has('alert-warning'))
            <div class="alert alert-warning py-3">{{ session('alert-warning') }}</div>
        @endif

        @if(!auth()->user()->acknowledged_migration)
            <div class="alert alert-info"><a href="{{ route('account-migrated-acknowledge') }}" class="alert-link" style="float: right;"><i class="fa fa-times"></i></a> <strong>Welcome to Fantasy Calendar 2.0!</strong> A lot has changed. <br><br>You <a class="alert-link" href="{{ route('whats-new') }}">check out what's new</a> to see a quick overview, or click a calendar below to see for yourself!</div>
        @endif

        @if(count($invitations))
            @foreach($invitations as $invitation)
                <div class="alert alert-primary d-md-flex justify-content-between align-content-center">
                    <span class="py-2">You've been invited to '{{ $invitation->calendar->name }}' created by '{{ $invitation->calendar->user->username }}'.</span>
                    <hr class="d-md-none">
                    <div class="text-right text-md-left">
                        <a class="btn btn-primary" href="{{ route('invite.accept', ['token' => $invitation->invite_token]) }}">Accept invitation</a>
                        <a class="btn btn-outline-secondary" href="{{ route('invite.reject-confirm', ['token' => $invitation->invite_token]) }}"><i class="fa fa-trash"></i></a>
                    </div>
                </div>
            @endforeach
        @endif

        @if(count($calendars) == 0 && !$search)
            <div class="row text-center my-5 py-4">
                <div class="col-12 col-md-6 py-5 text-left">
                    <h2>Create Your Own Calendar</h2>
                    <p class="mt-4">From zero to tracking your story in just a few easy steps.</p>
                    <a href="{{ route('calendars.create') }}" class="btn btn-primary my-5">Create a Calendar</a>
                </div>
                <div class="d-none d-md-block col-md-6 py-5" style="min-height: 100%; background-image: url({{ asset('resources/calendar_list_empty.svg') }}); background-repeat: no-repeat; background-size: contain; background-position: right center;">
                </div>
            </div>
        @endif

        @if($calendars->hasPages() || $search)
            <div class="d-flex flex-column flex-md-row justify-content-between">
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

                <span class="d-none d-md-block">{{ $calendars->onEachSide(1)->links() }}</span><span class="d-block d-md-none">{{ $calendar_pagination->links() }}</span>
            </div>
        @endif

        @if(!count($shared_calendars) && !count($calendars) && $search)
            <h2 class="text-center border py-4" style="opacity: 0.7;">No calendars match '{{ $search }}'</h2>
        @endif

        @if(count($calendars) > 0 || count($shared_calendars) > 0)

            @if(count($calendars) > 0 && !$search)
                <h1>My Calendars</h1>
            @endif

            @foreach($calendars as $index => $calendar)

                <div class="row border-top py-3 calendar-entry list-group-item-action w-auto @if($calendar->disabled) calendar-disabled protip @endif" @if($calendar->disabled) data-pt-title="Free accounts are limited to two calendars. You'll need to re-subscribe to use this one." @endif>
                    <div class="col-6 col-md-4 col-lg-5">
                        <a href="{{ route('calendars.edit', ['calendar'=> $calendar->hash]) }}"><h4 class="calendar-name">{{ $calendar->name }} @if($calendar->converted_at) <small style="font-size: 44%; position: relative; top: -4px;" class="small badge badge-secondary d-none d-md-inline">Converted {{ $calendar->converted_at }}</small> @endif <br><span class="creator_name">{{ $calendar->user->username }}</span></h4></a>
                    </div>
                    <div style="padding-left: 33px;" class="d-none d-md-block col-md-4 col-lg-3">
                        <i class="fa fa-calendar" style="margin-left: -20px;"></i> {{ $calendar->current_date }} <br>
                        @if($calendar->clock_enabled)
                            <i class="fa fa-clock" style="margin-left: -20px;"></i> {{ $calendar->current_time }} <br>
                        @endif
                        @if($calendar->current_era_valid)
                            <i class="fa fa-infinity" style="margin-left: -20px;"></i> {{ $calendar->current_era }}
                        @endif
                    </div>
                    <div class="d-none d-lg-block col-lg-1 protip">
                        <i class="fa fa-calendar-check"></i> {{ $calendar->events->count() }} <br>
                        @if($calendar->users->count())
                            <i class="fa fa-user"></i> {{ $calendar->users->count() }}
                        @endif
                    </div>
                    <div class="col-6 col-md-4 col-lg-3 text-right">
                        <div class="btn-group">
                            <a class='calendar_action btn btn-outline-secondary action-edit protip' data-pt-delay-in="500" data-pt-title="Edit '{{ $calendar->name }}'" href='{{ route('calendars.edit', ['calendar'=> $calendar->hash ]) }}'>
                                <i class="fa fa-edit"></i> <span class="d-none d-md-inline">Edit</span>
                            </a>
                            <a class='calendar_action btn btn-outline-secondary action-show protip' data-pt-delay-in="500" data-pt-title="View '{{ $calendar->name }}'" href='{{ route('calendars.show', ['calendar'=> $calendar->hash ]) }}'>
                                <i class="fa fa-eye"></i> <span class="d-none d-md-inline">View</span>
                            </a>
                            <button class="calendar_action btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" type="button" id="dropdownButton-{{ $calendar->hash }}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                            <div class="calendar_action dropdown-menu dropdown-menu-right" aria-labelledby="dropdownButton-{{ $calendar->hash }}">
                                <a class='dropdown-item action-edit protip d-md-none' data-pt-delay-in="500" data-pt-title="Edit '{{ $calendar->name }}'" href='{{ route('calendars.edit', ['calendar'=> $calendar->hash ]) }}'>
                                    <i class="fa fa-edit"></i> Edit
                                </a>
                                <a class='dropdown-item action-show protip d-md-none' data-pt-delay-in="500" data-pt-title="View '{{ $calendar->name }}'" href='{{ route('calendars.show', ['calendar'=> $calendar->hash ]) }}'>
                                    <i class="fa fa-eye"></i> View
                                </a>
                                <a class="dropdown-item copy_button action-copy protip" data-pt-delay-in="500" data-pt-title="Copy '{{ $calendar->name }}'" href="javascript:" data-hash="{{ $calendar->hash }}" data-name="{{ $calendar->name }}">
                                    <i class="fa fa-copy"></i> Copy
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
                <div class="row d-flex justify-content-end pt-3"><span class="d-none d-md-block">{{ $calendars->onEachSide(1)->links() }}</span><span class="d-block d-md-none">{{ $calendar_pagination->links() }}</span></div>
                <h2>Calendars shared with me</h2>

                @foreach($shared_calendars as $index => $calendar)
                    <div class="row border-top py-3 calendar-entry list-group-item-action w-auto">
                        <div class="col-6 col-md-4 col-lg-5">
                            <a href="{{ route('calendars.show', ['calendar'=> $calendar->hash]) }}"><h4 class="calendar-name">{{ $calendar->name }} <small class="badge badge-secondary" style="font-size: 44%; position: relative; top: -4px; margin-left: 4px;">{{ $calendar->pivot->user_role }}</small> <br><span class="creator_name">{{ $calendar->user->username }}</span></h4></a>
                        </div>
                        <div style="padding-left: 33px;" class="d-none d-md-block col-md-4 col-lg-3">
                            <i class="fa fa-calendar" style="margin-left: -20px;"></i> {{ $calendar->current_date }} <br>
                            @if($calendar->clock_enabled)
                                <i class="fa fa-clock" style="margin-left: -20px;"></i> {{ $calendar->current_time }}
                            @endif
                        </div>
                        <div class="d-none d-lg-block col-lg-1 protip">
                        <span class="protip" data-pt-delay-in="200" data-pt-title="{{ $calendar->name }} has {{ $calendar->events->count() }} events.">
                            <i class="fa fa-calendar-check"></i> {{ $calendar->events->count() }}
                        </span>
                        </div>
                        <div class="col-6 col-md-4 col-lg-3 text-right">
                            <div class="btn-group">
                                <a class='calendar_action btn btn-outline-secondary action-show protip' data-pt-delay-in="500" data-pt-title="View '{{ $calendar->name }}'" href='{{ route('calendars.show', ['calendar'=> $calendar->hash ]) }}'>
                                    <i class="fa fa-eye"></i> <span class="d-none d-md-inline">View</span>
                                </a>
                            </div>
                        </div>
                    </div>
                @endforeach
            @endif
        @endif
    </div>

@endsection
