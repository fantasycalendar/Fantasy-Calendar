@extends('templates._page')

@push('head')
    <script>
        $(document).ready(function() {
            $('.delete_button').click(function() {
                let calendar_hash = $(this).attr('data-hash');
                let calendar_name = $(this).attr('data-name');

                delete_calendar(calendar_hash, calendar_name, function() {location.reload();});
            });

            $('.copy_button').click(function() {
                let calendar_hash = $(this).attr('data-hash');
                let calendar_name = $(this).attr('data-name');

                copy_calendar(calendar_hash, calendar_name, function() {location.reload();});
            })
        });
    </script>
@endpush


@section('content')
    <div class="container py-5">
        <h1>My Calendars</h1>
            @foreach($calendars as $index => $calendar)
                <hr>
                <div class="row">
                    <div class="col-6 col-md-4 col-lg-5">
                        <h4 class="calendar-name">{{ $calendar->name }} <br><small>{{ $calendar->user->username }}</small></h4>
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
                            <a class='calendar_action btn btn-secondary action-edit protip' data-pt-delay-in="500" data-pt-title="Edit '{{ $calendar->name }}'" href='{{ route('calendars.edit', ['calendar'=> $calendar->hash ]) }}'>
                                <i class="fa fa-edit"></i> <span class="d-none d-md-inline">Edit</span>
                            </a>
                            <a class='calendar_action btn btn-secondary action-show protip' data-pt-delay-in="500" data-pt-title="View '{{ $calendar->name }}'" href='{{ route('calendars.show', ['calendar'=> $calendar->hash ]) }}'>
                                <i class="fa fa-eye"></i> <span class="d-none d-md-inline">View</span>
                            </a>
                            <button class="calendar_action btn btn-secondary dropdown-toggle dropdown-toggle-split" type="button" id="dropdownButton-{{ $calendar->hash }}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
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
        @isset($changelog)
            <hr>
            <h2 class="pt-5">Changelog</h2>

            <div class="changelog__content">
                {!! $changelog !!}
            </div>
        @endisset
    </div>

@endsection
