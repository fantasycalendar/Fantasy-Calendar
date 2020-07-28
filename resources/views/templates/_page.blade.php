<!DOCTYPE HTML>

<html lang="en" prefix="og: http://ogp.me/ns#">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="description" content="All-in-One Fantasy Calendar Generator - Creation of calendars and time-tracking in your homebrew or pre-made campaign worlds have never been easier!">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta property="og:title" content="{{ $calendar->name ?? $title ?? "Fantasy Calendar" }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->full() }}">
    <meta property="og:image" content="{{ asset('resources/discord_logo.jpg') }}">

    <title>
        Welcome to Fantasy Calendar
    </title>

    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('/resources/apple-touch-icon.png') }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('/resources/favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('/resources/favicon-16x16.png') }}">
    <link rel="manifest" href="{{ asset('/resources/site.webmanifest') }}">
    <link rel="mask-icon" href="{{ asset('/resources/safari-pinned-tab.svg') }}" color="#2f855a">
    <link rel="shortcut icon" href="{{ asset('/resources/favicon.ico') }}">
    <meta name="msapplication-TileColor" content="#2f855a">
    <meta name="msapplication-config" content="{{ asset("/resources/browserconfig.xml") }}">
    <meta name="theme-color" content="#2f855a">

    <script src="{{ mix('js/app.js') }}"></script>

    <script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.17.0/dist/jquery.validate.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>

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
        });
    </script>

    <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css" />
    <script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>

    <script src="{{ asset('js/login.js') }}"></script>

    <script src="{{ mix('js/calendar/header.js') }}"></script>

    @if(Auth::check() && Auth::user()->setting('dark_theme') && !request()->is('/'))
        <link rel="stylesheet" href="{{ mix('css/app-dark.css') }}">
    @else
        <link rel="stylesheet" href="{{ mix('css/app.css') }}">
    @endif

    @stack('head')
</head>


<body class="page-{{ str_replace('.', '-', Route::currentRouteName()) }} @stack('page-class')">

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
        <div id="protip_container"></div>
    </body>
</html>
