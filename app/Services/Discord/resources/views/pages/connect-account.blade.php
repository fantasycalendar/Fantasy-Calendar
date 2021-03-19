@extends('templates._page')

@push('head')
    <style>
        h1 {
            font-size: 2rem;
        }
        h2 {
            font-size: 1.7rem;
        }
        h3 {
            font-size: 1.4rem;
        }
        h4 {
            font-size: 1.1rem;
        }
        .logo-wrapper {
            height: 6rem;
            width: 6rem;
            display: grid;
            place-items: center;
        }
        .connect-box {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .fa-discord, .discord-color {
            color: #7289DA;
        }
        .discord-bg {
            background-color: #7289DA;
        }
        .btn-discord {
            background-color: #7289DA;
            transition: all 0.2s ease-in-out;
            color: white;
        }
        .btn-discord:hover {
            background-color: #2f855a;
            color: white;
        }
    </style>
@endpush

@section('content')
    <div class="container py-5">
        <h1>Connect your Fantasy Calendar account with Discord!</h1>
        <h3 style="opacity: 0.65;">Don't worry, we only use the minimum necessary to make integrations work. As Discord will tell you, neither of the options below lets us read your messages or anything like that.</h3>

        <div class="row">
            <div class="col-12 flex align-items-center mb-4">
                <div class="connect-box py-4 w-100 border rounded my-4">

                    <div class="logo-wrapper">
                        <img src="{{ asset('resources/logo-accent.png') }}" alt="" style="max-height: 5.2rem;">
                    </div>

                    <div class="logo-wrapper">
                        <i class="fa fa-arrows-alt-h" style="font-size: 3rem;"></i>
                    </div>

                    <div class="logo-wrapper">
                        <i class="fab fa-discord" style="font-size: 5.6rem; margin-bottom: -.7rem;"></i>
                    </div>
                </div>
            </div>

            <div class="col-12 text-center mt-8 pb-2">
                <h2>There are two different ways to connect, depending on what you need.</h2>
            </div>

            <div class="col-12 col-md-6">
                <div class="inner h-100 border rounded w-100 p-3 text-center">
                    <h4>To use an existing Fantasy Calendar integration <p class="lead small pt-1" style="opacity: 0.7;">in someone else's Discord server</p></h4>

                    <a href="{{ route('discord.auth.user') }}" class="btn btn-lg btn-discord my-3">Connect with Discord</a>
                </div>
            </div>

            <div class="col-12 col-md-6">
                <div class="inner h-100 border rounded w-100 p-3 text-center">
                    <h4>To setup a new Fantasy Calendar integration <p class="lead small pt-1" style="opacity: 0.7;">in a Discord server you own or admin</p></h4>

                    <a href="{{ route('discord.auth.admin') }}" class="btn btn-lg btn-discord my-3">Connect with Discord</a>
                </div>
            </div>

            <div class="col-12 pt-4">
                <div class="inner">
                    <div class="table-responsive mt-2 border rounded">
                        <table class="table">
                            <thead>
                            <tr>
                                <th scope="col">What this gives us</th>
                                <th scope="col">How we use it</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th scope="row">Your email</th>
                                <td>Used for any notifications about this integration</td>
                            </tr>
                            <tr>
                                <th scope="row">Discord ID</th>
                                <td>Used to associate your Discord account with your Fantasy Calendar account, for permissions</td>
                            </tr>
                            <tr>
                                <th scope="row">List of servers you're in</th>
                                <td>Required to create commands in servers you own</td>
                            </tr>
                            <tr>
                                <th scope="row">Application command creation</th>
                                <td>Lets us create slash-commands in servers you're in</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    </div>
@endsection
