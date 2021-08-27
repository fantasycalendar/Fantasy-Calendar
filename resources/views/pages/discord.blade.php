@extends('templates._page')

@section('content')
    <div class="container py-5">
        <div class="row">
            <div class="col-md-12 d-flex flex-column justify-content-center">
                <h1>Discord <i class="fas fa-plus h3 px-3" style="vertical-align: middle;"></i> Fantasy Calendar</h1>

                <h2>Available for subscribers</h2>
                <p>Fantasy Calendar is now available on Discord! If you're subscribed to Fantasy Calendar, you can connect your discord account to Fantasy Calendar!</p>
                <h3>Show current date</h3>
                <p>You can show the current date!</p>
                <h3>See calendar directly in discord</h3>
                <p>It's as simple as typing <code>/fc show month</code></p>
                <h3>Advance the date & time</h3>
                <p>Just as easy! Just type: <code>/fc [add|sub] [minutes|hours|days|months|years] [number]</code></p>
                <h3>Display linked calendar dates</h3>
                <p>Have you got plenty of calendars linked together? You can show them in discord as well.</p>
            </div>
        </div>
    </div>
@endsection
