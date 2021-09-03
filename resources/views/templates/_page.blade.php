<!DOCTYPE HTML>

<html lang="en" prefix="og: http://ogp.me/ns#">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="description" content="All-in-One Fantasy Calendar Generator - Creation of calendars and time-tracking in your homebrew or pre-made campaign worlds has never been easier!">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta property="og:title" content="{{ $calendar->name ?? $title ?? "Fantasy Calendar" }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->full() }}">
    <meta property="og:image" content="{{ asset('resources/logo_discord.jpg') }}">
    <meta property="og:description" content="All-in-One Fantasy Calendar Generator - Creation of calendars and time-tracking in your homebrew or pre-made campaign worlds has never been easier!">

    @if(Auth::check())
        <meta name='api-token' content="{{ Auth::user()->api_token }}">
    @endif

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

    <script src="{{ asset('js/login.js') }}"></script>

    <script src="{{ mix('js/calendar/header.js') }}"></script>
    <script src="{{ mix('js/calendar/calendar_ajax_functions.js') }}"></script>

    @if(Auth::check() && Auth::user()->setting('dark_theme') && !request()->is('/') && !request()->is('whats-new') && !request()->is('faq'))
        <link rel="stylesheet" href="{{ mix('css/app-dark.css') }}">
    @else
        <link rel="stylesheet" href="{{ mix('css/app.css') }}">
    @endif

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

		@include('templates._header')
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
