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

                swal({
                    text: "If you're sure about deleting this calendar, please type '" + calendar_name + "' below:",
                    content: "input",
                    dangerMode: true,
                    buttons: [
                        true,
                        {
                            text: "Delete",
                            closeModal: false,
                        }
                    ]
                })
                .then(name => {
                    if (name !== calendar_name) throw "Sorry! " + name + " isn't the same as " + calendar_name;

                    return axios.delete('/api/calendar/' + calendar_hash);
                })
                .then(results => {
                    if(results.data.error) {
                        throw "Error: " + results.data.message;
                    }

                    swal({
                        icon: "success",
                        title: "Deleted!",
                        text: "The calendar " + calendar_name + " has been deleted.",
                        button: true
                    })
                    .then(success => {
                        location.reload();
                    })
                })
                .catch(err => {
                    if(err) {
                        console.log(err);
                        swal("Oh no!", err, "error");
                    } else {
                        swal.stopLoading();
                        swal.close();
                    }
                });
            });
        });
    </script>
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
                                    <a class="calendar_action" href="{{ route('calendars.export', ['calendar' => $calendar->hash]) }}" >
                                        <i class="fa fa-file-export"></i>
                                    </a>
                                    <a class="calendar_action delete_button" href="javascript:" data-hash="{{ $calendar->hash }}" data-name="{{ $calendar->name }}">
                                        <i class="fa fa-calendar-times"></i>
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
