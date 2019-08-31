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
@endpush

@section('content')
    <div class="container">
        @isset($calendars)
                <div class='row'>
                    @foreach($calendars as $calendar)
                        <div class="col-sm-6 col-md-4 col-lg-3">
                            <div class='user_calendar card text-center'>
                                <div class="card-header">
                                    <h5 class="calendar__list-name">{!! $calendar->name !!}</h5>
                                    <span class="calendar__list-username">{{ $calendar->user->username }}</span>
                                </div>
                                <div class="card-body">
                                    <div class='icon_container'>
                                        <a class='calendar_action' href='{{ route('calendars.edit', ['id'=> $calendar->hash ]) }}'>
                                            <i class="fa fa-edit"></i>
                                        </a>
                                        <a class='calendar_action' href='{{ route('calendars.show', ['id'=> $calendar->hash ]) }}'>
                                            <i class="fa fa-eye"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
        @endisset

        @isset($changelog)
            <div class="detail-row">
                <div class='detail-column full'>
                    <div id='changelog'>
                        <h2>Changelog</h2>

                        <div class="changelog__content">
                        {!! $changelog !!}
                        </div>
                    </div>
                </div>
            </div>
        @endisset
    </div>
@endsection
