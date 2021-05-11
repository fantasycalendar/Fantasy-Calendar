@extends('templates._error')

@section('content')
    <div class="container py-5 px-3 error-container">
        <div class="row w-100">
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
