@extends('templates._page')

@section('content')
    <div class="container pt-5">
        <div class="card">
            <div class="card-header">Are you sure?</div>
            <div class="card-body">
                <div class="pb-3">{{ $invitation->calendar->user->username }} invited you as a user on <strong>{{ $invitation->calendar->name }}</strong>.<br>
                    Rejecting this invitation cannot be undone, and they will have to invite you again if you change your mind. <br><br>
                    Are you sure you want to reject this invitation?</div>
                <form action="{{ route('invite.reject') }}" method="POST">
                    @csrf
                    <input type="hidden" name="token" value="{{ $invitation->invite_token }}">

                    <button type="submit" class="btn btn-danger">Yes, reject this invitation.</button>
                    <a href="{{ route('calendars.index') }}" class="btn btn-secondary">No, don't reject it.</a>
                </form>
            </div>
        </div>
    </div>
@endsection
