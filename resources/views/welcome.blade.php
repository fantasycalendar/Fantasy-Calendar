@extends('templates._page')

@push('head')
    <link href="https://fonts.googleapis.com/css?family=PT+Sans:400,700|Open+Sans:400,200&display=swap" rel="stylesheet">
    <style>
        section {
            font-family: "PT Sans", sans-serif;
        }

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
            font-size: 18px;
        }

        section.promos {
            margin: 72px 0;
        }

        section.promos .inner {
            background-color: #e7e7e7;
            padding: 10px 14px;
        }

        section.promos i {
            font-size: 32px;
        }

        section.promos h3 {
            font-size: 26px;
            min-height: 62px;
            line-height: 62px;
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
    </style>
@endpush

@section('content')
    <section class="jumbotron jumbotron-fluid">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-3 logo">
                    <img src="{{ asset('resources/jumbotron_logo.png') }}">
                </div>
                <div class="col-9 herotext">
                    <h1>Fantasy Calendar</h1>
                    <p class="lead">Whether you're an RPG DM just looking to track the events of a long-running Forgotten Realms campaign, or a fanciful world-builder who likes to have wacky celestial configurations (Such as Eberron's 12 moons) with zany timekeeping systems to match, you probably need a calendar of some kind.</p>
                </div>
            </div>
        </div>
    </section>


    <section class="promos">
        <div class="container">
            <div class="row">
                <div class="col-3 ml-0 pl-0 pr-1">
                    <div class="inner">
                        <p class="text-center"><i class="fa fa-check-circle"></i></p>
                        <h3 class="text-center">Easy to Use</h3>
                        <p class="small">The controls of Fantasy Calendar have been lovingly hand-crafted to <strong>make sense</strong>. With a detailed wiki to make up for the parts that don’t.</p>
                    </div>
                </div>
                <div class="col-3 px-1">
                    <div class="inner">
                        <p class="text-center"><i class="fa fa-mobile"></i></p>
                        <h3 class="text-center">Mobile-Friendly</h3>
                        <p class="small">Because you never know when you might have a great idea for a calendar system, or want to track events in that pick-up D&D game at the games store.</p>
                    </div>
                </div>
                <div class="col-3 px-1">
                    <div class="inner">
                        <p class="text-center"><i class="fa fa-rocket"></i></p>
                        <h3 class="text-center">Light &amp; Responsive</h3>
                        <p class="small">Your fantasy world’s calendar should help you keep time, not waste yours. Keep game time even on low-end computers, netbooks, or chromebooks.</p>
                    </div>
                </div>
                <div class="col-3 mr-0 pr-0 pl-1">
                    <div class="inner">
                        <p class="text-center"><i class="fa fa-calendar-day"></i></p>
                        <h3 class="text-center lower-height">Powerful Calendar Engine</h3>
                        <p class="small">Intercalaries! Leap days! Moons! Seasons! Cycles! Eras!<br>
                            If those words mean anything to you, welcome to your home for keeping track of it all.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>


    <section class="quoteblock">
        <div class="container">
            <div class="quote">
                “Game time is of utmost importance. Failure to keep careful track of time expenditure by player characters will result in many anomalies in the game. The stricture of time is what makes recovery of hit points meaningful. [...] All of these demands upon game time force choices upon player characters and likewise number their days of game life…YOU CAN NOT HAVE A MEANINGFUL CAMPAIGN IF STRICT TIME RECORDS ARE NOT KEPT.”
            </div>
            <div class="name">Gary Gygax</div>
        </div>
    </section>


    <section class="footer">
        <div class="logo"><img src="{{ asset('resources/header_logo.png') }}"></div>
        <div class="copyright">© Copyright {{ date('Y') }} Fantasy Calendar Ltd.</div>
    </section>
@endsection
