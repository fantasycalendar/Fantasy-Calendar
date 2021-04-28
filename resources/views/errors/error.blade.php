@extends('templates._error')

@section('content')
    <div class="container py-5 px-3 error-container">
        <div class="row">
            <div class="d-none d-lg-flex col-lg-5 flex-column justify-content-center">
                <div class="sketch">
                    <div class="bee-sketch red"></div>
                    <div class="bee-sketch blue"></div>
                </div>
            </div>

            <div class="col-12 col-lg-7 d-flex flex-column justify-content-center">
                <h1>An error has occurred.</h1>
                <h2 class="pb-2">This was probably <strong>not</strong> your fault.</h2>

                <p style="line-height: 1.4; font-weight: 300; font-family: 'Montserrat', sans-serif;">
                    In fact, this error page usually means something is <strong style="font-weight: 500;">INCREDIBLY</strong> broken, like our database is unreachable. Hopefully, our monitoring tools will have caught it, and we're already looking into it.<br>
                    <br>
                    There are a few steps you can take, however:
                </p>

                <ul class="bd-callout bd-callout-warning text-left">
                    <li class="pb-2">Check out <a href="https://fantasy-calendar.instatus.com">our status page</a>. <br>That's where we post status updates if we're aware of what's going on.</li>
                    <li class="pb-2">Try just going to <a href="{{ route('calendars.index') }}">the home page</a> and see if that errors too (it probably will, that's ok)</li>
                    <li class="pb-2">Reach out to us on <a href="https://discord.gg/BNSM7aT">Discord!</a> <br>We're a two-man team who do this in our free time, so we appreciate your patience.</li>
                </ul>
            </div>
        </div>
    </div>
@endsection

@push('head')
    <style>
    @import url('https://fonts.googleapis.com/css?family=Cabin+Sketch|Montserrat:300,500');

    .bd-callout {
        padding: 0.65rem 1.25rem 0.65rem 2rem;
        margin-top: 1.25rem;
        margin-bottom: 1.25rem;
        border: 1px solid #e9ecef;
        border-left-width: .25rem;
        border-radius: .25rem;
    }

    .bd-callout-warning {
        border-left-color: #f0ad4e;
    }

    h1, h2 {
        font-family: 'Cabin Sketch', cursive;
    }

    #content {
        display: flex;
    }

    .error-container {
        min-height: 100%;
        display: grid;
        place-items: center;
    }

    h1 {
        font-size: 3em;
        opacity: .8;
    }

    h1 small {
        display: block;
    }

    .sketch {
        height: 400px;
        min-width: 400px;
    }

    .bee-sketch {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 30px;
        left: 0;
    }

    .red {
        background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-1.png) no-repeat center center;
        opacity: 1;
        animation: red 3.5s linear infinite, opacityRed 5s linear alternate infinite;
    }

    .blue {
        background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-1.png) no-repeat center center;
        opacity: 0;
        animation: blue 3.5s linear infinite, opacityBlue 5s linear alternate infinite;
    }

    @keyframes blue {
        0% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-1.png)
    }
        9.09% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-2.png)
    }
        27.27% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-3.png)
    }
        36.36% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-4.png)
    }
        45.45% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-5.png)
    }
        54.54% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-6.png)
    }
        63.63% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-7.png)
    }
        72.72% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-8.png)
    }
        81.81% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-9.png)
    }
        100% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-1.png)
    }
    }

    @keyframes red {
        0% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-1.png)
    }
        9.09% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-2.png)
    }
        27.27% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-3.png)
    }
        36.36% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-4.png)
    }
        45.45% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-5.png)
    }
        54.54% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-6.png)
    }
        63.63% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-7.png)
    }
        72.72% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-8.png)
    }
        81.81% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-9.png)
    }
        100% {
            background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-1.png)
    }
    }

    @keyframes opacityBlue {
        from {
            opacity: 0
        }
        25% {
            opacity: 0
        }
        75% {
            opacity: 1
        }
        to {
            opacity: 1
        }
    }

    @keyframes opacityRed {
        from {
            opacity: 1
        }
        25% {
            opacity: 1
        }
        75% {
            opacity: .3
        }
        to {
            opacity: .3
        }
    }
    </style>
@endpush
