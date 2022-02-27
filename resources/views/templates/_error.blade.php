<!DOCTYPE HTML>

<html lang="en" prefix="og: http://ogp.me/ns#">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="description" content="All-in-One Fantasy Calendar Generator - Creation of calendars and time-tracking in your homebrew or pre-made campaign worlds has never been easier!">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta property="og:title" content="Fantasy Calendar Error Page">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->full() }}">
    <meta property="og:image" content="{{ asset('resources/logo_discord.jpg') }}">
    <meta property="og:description" content="All-in-One Fantasy Calendar Generator - Creation of calendars and time-tracking in your homebrew or pre-made campaign worlds has never been easier!">

    <title>
        Welcome to Fantasy Calendar
    </title>

    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('/resources/apple-touch-icon.png') }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('/resources/favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('/resources/favicon-16x16.png') }}">
    <link rel="manifest" href="{{ asset('/resources/site.webmanifest') }}">
    <link rel="mask-icon" href="{{ asset('/resources/safari-pinned-tab.svg') }}" color="#2f855a">
    <link rel="shortcut icon" href="{{ asset('/resources/favicon.ico') }}">
    <meta name="apple-mobile-web-app-title" content="Fantasy Calendar">
    <meta name="application-name" content="Fantasy Calendar">
    <meta name="msapplication-TileColor" content="#2f855a">
    <meta name="msapplication-config" content="{{ asset("/resources/browserconfig.xml") }}">
    <meta name="theme-color" content="#2f855a">


    <script src="{{ mix('js/app.js') }}"></script>
    <script src="https://js.stripe.com/v3/"></script>

    <script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.17.0/dist/jquery.validate.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <script src="https://rawgit.com/notifyjs/notifyjs/master/dist/notify.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.6.0/dist/alpine.min.js" defer></script>

    <script>
        $(document).ready(function(){
            window.baseurl = '{{ getenv('WEBADDRESS') }}';
            window.apiurl = '{{ getenv('WEBADDRESS') }}'+'api';

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                    'Authorization': 'Bearer '+$('meta[name="api-token"]').attr('content')
                }
            });

            $.protip({
                defaults: {
                    "delay-in": 2000,
                    position: 'bottom',
                    scheme: 'leaf',
                    classes: 'box-shadow accent-bg-color',
                    animate: 'bounceIn',
                    target: '#protip_container'
                }
            });

            var cookiedomain = window.location.hostname.split('.')[window.location.hostname.split('.').length-2]+'.'+window.location.hostname.split('.')[window.location.hostname.split('.').length-1];
            document.cookie = 'fantasycalendar_remember=; Max-Age=0; path=/; domain=' + cookiedomain;
        });

    </script>

    <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css" />
    <script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>

    <script src="{{ mix('js/calendar/header.js') }}"></script>
    <script src="{{ mix('js/calendar/calendar_ajax_functions.js') }}"></script>

    <link rel="stylesheet" href="{{ mix('css/app.css') }}">

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

    @stack('head')
</head>


<body class="page page-{{ str_replace('.', '-', Route::currentRouteName()) }} @stack('page-class')">
        @env(['development'])
        <div class="alert alert-danger py-1 mb-0 text-center" style="border-radius: 0;">
                <div style="max-width: 1100px; margin: auto;">
                    This is the beta deployment of Fantasy Calendar. Use with caution.
                </div>
            </div>
        @endenv

        <nav class="navbar navbar-expand-lg navbar-dark bg-accent">
            <a class="navbar-brand" href="{{ route('home', [], false) }}">
                <img class="navbar-logo mr-2" src="{{ asset('resources/header_logo.png') }}">
                Fantasy Calendar
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsemenu" aria-controls="collapsemenu" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="collapsemenu">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item new-calendar">
                        <a class="nav-link" href="{{ route('calendars.create', [], false) }}">New Calendar</a>
                    </li>
                    <li class="nav-item"><a href="{{ route('whats-new', [], false) }}" class="nav-link">What's New in 2.0</a></li>
                    <li class="nav-item"><a href="{{ route('faq', [], false) }}" class="nav-link">FAQs</a></li>
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item"><a href="{{ route('subscription.pricing', [], false) }}" class="nav-link">Subscribe</a></li>
                    <li class="nav-item"><a href="{{ route('login', [], false) }}" class="nav-link">Login</a></li>
                    <li class="nav-item"><a href="{{ route('register', [], false) }}" class="nav-link">Register</a></li>
                </ul>
            </div>
        </nav>

        <div id="alert_background">
            <div id="alert">
                <span id="alert_closebtn" onclick="this.parentElement.parentElement.style.display='none';">&times;</span>
                <span id="alert_text">
			This is an alert box.
		</span>
            </div>
        </div>

        <div id="content">
			<div id="loading_background" class='basic-background blurred_background hidden'>
				<img class='loading_spinner' src='{{ asset("resources/icons/loader_white.png") }}'>
				<div id='loading_text' class='italics-text'>Random text</div>

				<div class="loading_bar hidden"></div>

				<div class='loading_cancel_button_container'>
					<button type='button' class='btn btn-danger full loading_cancel_button hidden'>Cancel</button>
				</div>
			</div>

			@yield('content')
		</div>
        @include('templates.footnote')
        <div id="protip_container" class='d-print-none'></div>
    </body>
</html>
