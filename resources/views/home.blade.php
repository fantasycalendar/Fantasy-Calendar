@extends('templates._page')

@push('head')
    <style type="text/css">
        .changelog__content h1 {
            font-size: 1.75rem;
        }
        .changelog__content h2 {
            font-size: 1rem;
            font-style: italic;
        }
        .changelog__content ul li {
            list-style-type: circle;
        }
        #changelog {
            margin-top: 40px;
        }
    </style>
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
    <div class="container calendar__list">
        <div class='row'>
        @empty($calendars)
            <div class="col-12 text-center">
                <h1 class="calendar__list-name">You don't have any calendars!</h1>
                <h2>To get started, create one below.</h2>
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3">
                <div class="card user_calendar text-center" style="cursor: pointer;" onclick="self.location = '{{ route('calendars.create') }}'">
                    <div class="card-header">
                        <h5>New Calendar</h5>
                    </div>
                    <div class="card-body">
                        <div class="icon_container">
                            <a href="{{ route('calendars.create') }}" class="calendar_action">
                                <i class="fa fa-plus"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        @else
            @foreach($calendars as $calendar)
                <div class="col-sm-6 col-md-4 col-lg-3">
                    <div class='user_calendar card text-center'>
                        <div class="card-header">
                            <h5 class="calendar__list-name">{!! $calendar->name !!}</h5>
                            <span class="calendar__list-username">{{ $calendar->user->username }}</span>
                        </div>
                        <div class="card-body">
                            <div class='icon_container'>
                                <a class='calendar_action action-edit protip' data-pt-delay-in="500" data-pt-title="Edit '{{ $calendar->name }}'" href='{{ route('calendars.edit', ['calendar'=> $calendar->hash ]) }}'>
                                    <i class="fa fa-edit"></i>
                                </a>
                                <a class='calendar_action action-show protip' data-pt-delay-in="500" data-pt-title="View '{{ $calendar->name }}'" href='{{ route('calendars.show', ['calendar'=> $calendar->hash ]) }}'>
                                    <i class="fa fa-eye"></i>
                                </a>
                                <a class="calendar_action copy_button action-copy protip" data-pt-delay-in="500" data-pt-title="Copy '{{ $calendar->name }}'" href="javascript:" data-hash="{{ $calendar->hash }}" data-name="{{ $calendar->name }}">
                                    <i class="fa fa-copy"></i>
                                </a>
                                <a class="calendar_action action-export protip" data-pt-delay-in="500" data-pt-title="Export '{{ $calendar->name }}'" href="{{ route('calendars.export', ['calendar' => $calendar->hash]) }}" >
                                    <i class="fa fa-file-export"></i>
                                </a>
                                <a class="calendar_action delete_button action-delete protip" data-pt-delay-in="500" data-pt-title="Delete '{{ $calendar->name }}'" href="javascript:" data-hash="{{ $calendar->hash }}" data-name="{{ $calendar->name }}">
                                    <i class="fa fa-calendar-times"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
                <div class="col-sm-6 col-md-4 col-lg-3">
                    <div class="card user_calendar text-center" style="cursor: pointer;" onclick="self.location = '{{ route('calendars.create') }}'">
                        <div class="card-header">
                            <h5>New Calendar</h5>
                        </div>
                        <div class="card-body">
                            <div class="icon_container">
                                <a href="{{ route('calendars.create') }}" class="calendar_action">
                                    <i class="fa fa-plus"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            @endempty
        </div>
        @isset($changelog)
            <h2>Changelog</h2>

            <div class="changelog__content">
            {!! $changelog !!}
            </div>
        @endisset
    </div>
@endsection
