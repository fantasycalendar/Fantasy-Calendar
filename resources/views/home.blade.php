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
    <div class="container calendar__list">
        @empty($calendars)
            <div class="row">
                <div class="col-3"></div>
                <div class="col-6">
                    <div class="card text-center">
                        <div class="card-header">
                            <h5 class="calendar__list-name">You don't have any calendars!</h5>
                            <span class="calendar__list-username">No worries though, create one below.</span><br>
                            @guest
                                <span class="calendar__list-username">(You'll need to <a href="{{ route('register') }}">register</a> in order to save it)</span>
                            @endguest
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
                <div class="col-3"></div>
            </div>
        @else
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
                                    <a class='calendar_action' href='{{ route('calendars.edit', ['calendar'=> $calendar->hash ]) }}'>
                                        <i class="fa fa-edit"></i>
                                    </a>
                                    <a class='calendar_action' href='{{ route('calendars.show', ['calendar'=> $calendar->hash ]) }}'>
                                        <i class="fa fa-eye"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        @endempty

        @isset($changelog)
            <h2>Changelog</h2>

            <div class="changelog__content">
            {!! $changelog !!}
            </div>
        @endisset
    </div>
@endsection
