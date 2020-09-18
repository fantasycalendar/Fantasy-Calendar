@extends('templates._page')

@section('content')
    <div class="container pt-5">
        <div class="card">
            <div class="card-header">Invite Accepted!</div>
            <div class="card-body">
                <div class="alert alert-info">You've already accepted {{ $calendar->user->username }}'s invitation to join {{ $calendar->name }}!</div>
                <a href="{{ route('calendars.show', ['calendar' => $calendar]) }}" class="btn btn-primary">Go there now</a>
            </div>
        </div>
    </div>
@endsection
