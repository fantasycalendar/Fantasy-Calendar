@extends('templates._welcome')

@push('head')
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,200&display=swap" rel="stylesheet">
    <style>
        section.jumbotron {
            background-image: linear-gradient(to right, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.42)), url({{ asset('resources/jumbotron_bg.jpg') }});
            background-size: cover;
            background-position: center center;
        }

        section.jumbotron .container {
            background-color: rgba(255, 255, 255, 0.65);
            padding: 25px;
        }

        section.jumbotron .herotext {
            text-align: center;
            font-size: 64px;
            color: #323232;
        }

        section.jumbotron .herotext .lead {
            font-size: 17px;
        }

        section.promos {
            margin: 72px 0;
        }

        section.promos i {
            font-size: 32px;
        }

        section.promos h3 {
            font-size: 25px;
            min-height: 66px;
            line-height: 66px;
        }

        section.promos h3.lower-height {
            line-height: initial;
        }

        section.promos .small {
            font-size: 17px;
            font-family: 'Open Sans', sans-serif;
        }

        section.quoteblock {
            background-color: #2f855a;
            color: white;
            font-style: italic;
            text-align: center;
            font-family: 'Open Sans', sans-serif;
            font-size: 21px;
            padding: 65px 0;
            overflow: hidden;
        }

        section.quoteblock .container:before {
            content: "\f10d";
            position: absolute;
            font-size: 420px;
            left: -270px;
            bottom: -260px;
            color: white;
            font-family: 'Font Awesome 5 Free';
            font-style: initial;
            opacity: 0.13;
        }

        section.quoteblock .container:after {
            content: "\f10e";
            position: absolute;
            font-size: 420px;
            right: -270px;
            top: -260px;
            color: white;
            font-family: 'Font Awesome 5 Free';
            font-style: initial;
            opacity: 0.13;
        }

        section.quoteblock .container {
            position: relative;
        }

        section.quoteblock .quote {
            padding-bottom: 70px;
        }

        section.quoteblock .name {
            position: absolute;
            right: 0;
            bottom: 0;
            font-weight: bold;
            font-size: 32px;
        }

        section.footer {
            display: flex;
            background-color: #323232;
            justify-content: space-between;
            align-items: center;
            padding: 40px 20px;
            color: white;
        }

        section.footer * {
            opacity: 0.2;
        }

        @media screen and (max-width: 768px) {
            section.quoteblock .name {
                right: 40px;
            }
        }
    </style>
@endpush

@section('content')
    <section class="jumbotron jumbotron-fluid">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-12 col-md-3 d-none d-md-block logo text-center">
                    <img src="{{ asset('resources/jumbotron_logo.png') }}">
                </div>
                <div class="col-12 col-md-9 herotext">
                    <h1>Fantasy Calendar</h1>
                    <p class="lead">Whether you're a GM just looking to track the events of a long-running Forgotten Realms campaign, or a fanciful world-builder who likes to have wacky celestial configurations (such as Eberron's 12 moons) with zany timekeeping systems to match, you need Fantasy Calendar!</p>
                </div>
            </div>
        </div>
    </section>


    <section class="promos">
        <div class="container">
            <div class="row">
                <div class="col-12 col-md-3 py-3 py-md-0 px-2 ml-md-0 pl-md-0 pr-md-1">
                    <div class="inner text-center">
                        <p class="pt-2"><i class="fa fa-check-circle"></i></p>
                        <h3>Easy to Use</h3>
                        <p class="small">Fantasy Calendar has been lovingly hand-crafted to make sense. With a detailed wiki to make up for the parts that don’t.</p>
                    </div>
                </div>
                <div class="col-12 col-md-3 py-3 py-md-0 px-2 px-md-1">
                    <div class="inner text-center">
                        <p class="pt-2"><i class="fa fa-mobile"></i></p>
                        <h3>Mobile-Friendly</h3>
                        <p class="small">Because you never know when you might have a great idea for a calendar system, or want to track events in that pick-up D&D game at the games store.</p>
                    </div>
                </div>
                <div class="col-12 col-md-3 py-3 py-md-0 px-2 px-md-1">
                    <div class="inner text-center">
                        <p class="pt-2"><i class="fa fa-rocket"></i></p>
                        <h3>Light &amp; Responsive</h3>
                        <p class="small">Your fantasy world’s calendar should help you keep time, not waste yours. Keep game time even on low-end computers, netbooks, or chromebooks.</p>
                    </div>
                </div>
                <div class="col-12 col-md-3 py-3 py-md-0 px-2 mr-md-0 pr-md-0 pl-md-1">
                    <div class="inner text-center">
                        <p class="pt-2"><i class="fa fa-calendar-day"></i></p>
                        <h3 class="lower-height">Powerful Calendar Engine</h3>
                        <p class="small">This flexible calendar engine can accommodate whatever your world needs — intercalaries, leap days, moons cycles, seasons, eras, and more!</p>
                    </div>
                </div>
            </div>
        </div>
    </section>


    <section class="quoteblock">
        <div class="container">
            <div class="quote">
                “Game time is of utmost importance. Failure to keep careful track of time expenditure by player characters will result in many anomalies in the game. The stricture of time is what makes recovery of hit points meaningful. [...] All of these demands upon game time force choices upon player characters and likewise number their days of game life… You can not have a meaningful campaign if strict time records are not kept.”
            </div>
            <div class="name">Gary Gygax</div>
        </div>
    </section>


    <section class="footer flex-column flex-md-row">
        <div class="logo"><img src="{{ asset('resources/header_logo.png') }}"></div>
        <div class="copyright">© Copyright {{ date('Y') }} Fantasy Calendar Ltd.</div>
    </section>
@endsection
