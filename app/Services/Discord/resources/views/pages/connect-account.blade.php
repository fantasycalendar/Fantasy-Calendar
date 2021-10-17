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
        .bg-accent {
            color: white;
        }
        .bg-accent .alert-link {
            color: white;
        }

        @media only screen and (max-width: 768px) {
            /* Force table to not be like tables anymore */
            table,
            thead,
            tbody,
            th,
            td,
            tr {
                display: block;
            }

            /* Hide table headers (but not display: none;, for accessibility) */
            thead tr {
                position: absolute;
                top: -9999px;
                left: -9999px;
            }

            td {
                /* Behave like a "row" */
                border: none;
                position: relative;
                padding-left: 50%;
                white-space: normal;
                text-align:left;
            }

            td:before {
                /* Now like a table header */
                position: absolute;
                /* Top/left values mimic padding */
                top: 6px;
                left: 6px;
                width: 45%;
                padding-right: 10px;
                white-space: nowrap;
                text-align:left;
                font-weight: bold;
            }

            /*
            Label the data
            */
            td:before { content: attr(data-title); }
        }
    </style>
    <script>
        function confirmDisconnect() {
            swal.fire({
                title: "Are you sure?",
                text: "Your Discord account will be disconnected from Fantasy Calendar. Commands will no longer work for you, but you will still need to remove the app from any servers you don't want it in in order to remove it completely.",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                icon: "warning",
            }).then((result) => {
                if(!result.dismiss) {
                    self.location = '{{ route('discord.auth.remove') }}';
                }
            });
        }
    </script>
@endpush

@section('content')
    <div class="container py-5">
        @if(session()->has('message'))
            <div class="alert alert-success py-3 my-4">{{ session('message') }}</div>
        @endif

        @if(session()->has('alert'))
            <div class="alert alert-info py-3 my-4">{{ session('alert') }}</div>
        @endif

        @if(session()->has('error'))
            <div class="alert alert-danger py-3 my-4">{{ session('error') }}</div>
        @endif

        @unless(Auth::user()->hasDiscord())
            <h1>Connect your Fantasy Calendar account with Discord!</h1>
            <h4 class="lead" style="opacity: 0.65;">Don't worry, we only use the minimum necessary to make integrations work. As Discord will tell you, neither of the options below lets us read your messages or anything like that.</h4>
        @endunless

        <div class="row">
            @unless(Auth::user()->hasDiscord())
                <div class="col-12 flex align-items-center mb-3">
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

                <div class="col-12 text-center mt-5 pb-2">
                    <h2>There are two different ways to connect, depending on what you need.</h2>
                </div>
            @else
                <div class="col-12">
                    <h1>Account connected!</h1>
                </div>
            @endunless

            <div class="col-12 col-lg-6 mb-3">
                @unless(Auth::user()->hasDiscord())
                    <div class="inner h-100 border rounded w-100 p-3 text-center">
                        <h4>To use an <strong>existing</strong> Fantasy Calendar integration <p class="lead small pt-1" style="opacity: 0.7;">in someone else's Discord server</p></h4>

                        <a href="{{ route('discord.auth.user') }}" class="btn btn-lg btn-discord my-3">Connect to Use With Discord</a>
                    </div>
                @else
                    <div class="inner h-100 alert alert-success bg-accent p-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                        <div class="d-flex justify-content-start align-items-center">
                            <img class="mr-2 rounded-circle" style="max-height: 5rem;" src="{{ Auth::user()->discord_auth->avatar ?? asset('resources/logo-white.png') }}" alt="{{ Auth::user()->discord_auth->discord_username }}'s Discord avatar">
                            <h4 class="mb-0">
                                {{ Auth::user()->discord_auth->discord_username }}
                            </h4>
                        </div>
                        <hr class="d-md-none w-100 my-3" style="border-top-color: #246645;">
                        <a href="javascript:" onclick="confirmDisconnect()" class="btn btn-outline-danger alert-link">Disconnect</a>
                    </div>
                @endunless
            </div>

            <div class="col-12 col-lg-6 mb-3">
                <div class="inner h-100 border rounded w-100 p-3 text-center">
                    <h4>To setup a <strong>new</strong> Fantasy Calendar integration <p class="lead small pt-1" style="opacity: 0.7;">in a Discord server you own or admin</p></h4>

                    @unless(Auth::user()->hasDiscord())
                        <a href="{{ route('discord.auth.admin') }}" class="btn btn-lg btn-discord my-3">Connect to Your Discord Server</a>
                    @else
                        <a href="{{ route('discord.auth.admin') }}" class="btn btn-lg btn-discord my-3">Add Fantasy Calendar to a Server</a>
                    @endunless
                </div>
            </div>

            @if(Auth::user()->hasDiscord())
                <div class="col-12 pt-4">
                    <h3 class="text-center">Discord Command Quick Reference</h3>
                </div>

                <div class="col-12">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                            <tr>
                                <th scope="col" class="pl-3">Command</th>
                                <th scope="col" class="pl-4 pl-md-0">Description</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach(discord_help() as $command)
                                <tr>
                                    <td style="font-family: monospace;" class="font-weight-bold pl-3">{{ $command['command'] }}</td>
                                    <td class="italics-text pl-4 pl-md-0">{{ $command['description'] }}</td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            @else
                <div class="col-12">
                    <div class="inner">
                        <div class="table-responsive">
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
            @endif
        </div>
    </div>
@endsection
