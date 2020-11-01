@extends('templates._page')

@section('content')
    <div class="container w-50">
        <div class="row py-5">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="card-text">

                            <h3>Account Deletion Request</h3>

                            <p>At Fantasy-Calendar, we take your privacy seriously. If you feel the need to delete your account, we will do so as soon as possible, typically within 14 days.</p>

                            <p class='mb-0'>We will delete all of the following from our servers, irreversibly removing it:</p>

                            <ul>
                                <li>Username</li>
                                <li>Email Address</li>
                                <li>Registration IP</li>
                                <li>All of your calendars</li>
                                <li>All event categories on your calendars</li>
                                <li>All events on your calendars</li>
                                <li>All comments on your events</li>
                                <li>All of your active calendar invitations</li>
                            </ul>

                            <p>In addition, any active subscriptions will be cancelled.</p>

                            <p class='mb-0'>For financial reasons, we need to retain information regarding your past subscriptions:</p>

                            <ul>
                                <li>The last used card brand</li>
                                <li>The last four numbers of your card</li>
                            </ul>

                            <hr>

                            <form action="/set-account-deletion" method="POST">
                                @csrf

                                <label class="mt-2" for="password">Please enter your password to verify your identity:</label>
                                <input class="form-control required mb-2 @error('password') is-invalid @enderror" required type="password" name="password">

                                @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror

                                <button type="submit" class="btn btn-danger w-100 text-center">Request Account Deletion</a>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
