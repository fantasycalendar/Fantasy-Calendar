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
        @unless((count($calendars) || count($shared_calendars)) || $search)
            <div class="row text-center pb-4 border-bottom">
                <div class="col-12">
                    <h1>You don't have any calendars yet!</h1>
                    <a href="{{ route('calendars.create') }}" class="btn btn-primary">Create one now to get started!</a>
                </div>
            </div>
        @else
            <h1>Calendars</h1>

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

                    <span class="d-none d-md-block">{{ $calendars->onEachSide(1)->links() }}</span><span class="d-block d-md-none">{{ $calendar_pagination->links() }}</span></div>
            @endif

            @foreach($calendars as $index => $calendar)
                <div class="row border-top py-3 calendar-entry list-group-item-action w-auto">
                    <div class="col-6 col-md-4 col-lg-5">
                        <a href="{{ route('calendars.edit', ['calendar'=> $calendar->hash]) }}"><h4 class="calendar-name">{{ $calendar->name }} <br><small>{{ $calendar->user->username }}</small></h4></a>
                    </div>
                    <div style="padding-left: 33px;" class="d-none d-md-block col-md-4 col-lg-3">
                        <i class="fa fa-calendar" style="margin-left: -20px;"></i> {{ $calendar->current_date() }} <br>
                        @if($calendar->clock_enabled)
                            <i class="fa fa-clock" style="margin-left: -20px;"></i> {{ $calendar->current_time() }}
                        @endif
                    </div>
                    <div class="d-none d-lg-block col-lg-1 protip">
                        <span class="protip" data-pt-delay-in="200" data-pt-title="{{ $calendar->name }} has {{ $calendar->events->count() }} events.">
                            <i class="fa fa-calendar-check"></i> {{ $calendar->events->count() }}
                        </span>
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

            @if(!count($shared_calendars) && !count($calendars) && $search)
                <h2 class="text-center border py-4" style="opacity: 0.7;">No calendars match '{{ $search }}'</h2>
            @endif

            @if(count($shared_calendars))
                <div class="row d-flex justify-content-end border-top pt-3"><span class="d-none d-md-block">{{ $calendars->onEachSide(1)->links() }}</span><span class="d-block d-md-none">{{ $calendar_pagination->links() }}</span></div>
                <h2>Calendars shared with me</h2>

                @foreach($shared_calendars as $index => $calendar)
                    <div class="row border-top py-3 calendar-entry list-group-item-action w-auto">
                        <div class="col-6 col-md-4 col-lg-5">
                            <a href="{{ Auth::user()->can('update', $calendar) ? route('calendars.edit', ['calendar'=> $calendar->hash]) : route('calendars.show', ['calendar'=> $calendar->hash]) }}"><h4 class="calendar-name">{{ $calendar->name }} <small class="badge badge-secondary" style="font-size: 14px; position: relative; top: -4px; margin-left: 4px;">{{ $calendar->pivot->user_role }}</small> <br><small>{{ $calendar->user->username }}</small></h4></a>
                        </div>
                        <div style="padding-left: 33px;" class="d-none d-md-block col-md-4 col-lg-3">
                            <i class="fa fa-calendar" style="margin-left: -20px;"></i> {{ $calendar->current_date() }} <br>
                            @if($calendar->clock_enabled)
                                <i class="fa fa-clock" style="margin-left: -20px;"></i> {{ $calendar->current_time() }}
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
                                @if(Auth::user()->can('update', $calendar))
                                    <a class='calendar_action btn btn-outline-secondary action-edit protip' data-pt-delay-in="500" data-pt-title="Edit '{{ $calendar->name }}'" href='{{ route('calendars.edit', ['calendar'=> $calendar->hash ]) }}'>
                                        <i class="fa fa-edit"></i> <span class="d-none d-md-inline">Edit</span>
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
                                        <a class="dropdown-item action-export protip" data-pt-delay-in="500" data-pt-title="Export '{{ $calendar->name }}'" href="{{ route('calendars.export', ['calendar' => $calendar->hash]) }}" >
                                            <i class="fa fa-file-export"></i> Export
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item delete_button action-delete protip" data-pt-delay-in="500" data-pt-title="Delete '{{ $calendar->name }}'" href="javascript:" data-hash="{{ $calendar->hash }}" data-name="{{ $calendar->name }}">
                                            <i class="fa fa-calendar-times"></i> Delete
                                        </a>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                @endforeach
            @endif
        @endunless
        @isset($changelog)
            <h2 class="pt-5">Changelog</h2>

            <div class="changelog__content">
                {!! $changelog !!}
            </div>
        @endisset
    </div>

@endsection
