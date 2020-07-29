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
    <meta name="apple-mobile-web-app-title" content="Fantasy Calendar">
    <meta name="application-name" content="Fantasy Calendar">
    <meta name="msapplication-TileColor" content="#2f855a">
    <meta name="msapplication-config" content="{{ asset("/resources/browserconfig.xml") }}">
    <meta name="theme-color" content="#2f855a">

    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>


    <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css" />
    <script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>

    <link rel="stylesheet" href="{{ mix('css/app.css') }}">

    @stack('head')
</head>


<body class="page-welcome">

<nav class="navbar navbar-expand-lg navbar-dark bg-accent" x-data="{ open: false }">
    <a class="navbar-brand" href="{{ route('home') }}">
        <img class="navbar-logo mr-2" src="{{ asset('resources/header_logo.png') }}">
        Fantasy Calendar
    </a>
    <button class="navbar-toggler" type="button" @click="open = !open" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse show" x-show="open" id="collapsemenu">

        <ul class="navbar-nav mr-auto">
            @auth
                <li class="nav-item my-calendars">
                    <a class="nav-link" href="{{ route('calendars.index') }}">My Calendars</a>
                </li>
            @endauth
            <li class="nav-item new-calendar">
                <a class="nav-link" href="{{ route('calendars.create') }}">New Calendar</a>
            </li>
        </ul>
        <ul class="navbar-nav">
            @auth
                @if(Auth::user()->isAdmin())
                    <li class="nav-item"><a href="{{ route('code16.sharp.home') }}" class="nav-link">Admin Panel</a></li>
                @endif
                <li class="nav-item"><a href="{{ route('settings') }}" class="nav-link">Settings</a></li>
                <li class="nav-item"><a href="/profile" class="nav-link">Profile</a></li>
                @unless(request()->is('/calendar/*'))
                    <li class="nav-item"><a href="{{ route('logout') }}" class="nav-link">Logout</a></li>
                @else
                    <li class="nav-item"><a href="javascript:" id="logout-button" class="nav-link">Logout</a></li>
                @endunless
            @else
                @unless(request()->is('/calendar/*'))
                    <li class="nav-item"><a href="{{ route('login') }}" class="nav-link">Login</a></li>
                @else
                    <li class="nav-item"><a href="javascript:" id="login-show-button" class="nav-link">Login</a></li>
                @endunless

                <li class="nav-item"><a href="{{ route('register') }}" class="nav-link">Register</a></li>
            @endauth

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

@guest
    <div id="login-background" class="basic-background blurred_background">
        <div class="basic-container">
            <div class="basic-wrapper">
                <form id="login-form" class="basic-form" method="POST">
                    <h3 class="basic-form-heading">Login</h3>
                    <input type="text" class="form-control" id="login_identity" name="identity" placeholder="Username or E-mail" autofocus="" autocomplete="username" />
                    <input type="password" class="form-control" id="login_password" name="password" placeholder="Password" autocomplete="current-password" />
                    <div id="login_messagebox"></div>
                    <label class="form-control checkbox">
                        <input type="checkbox" value="remember-me" id="login_rememberMe" name="rememberMe"> Remember me
                    </label>
                    <button class="btn btn-lg btn-primary btn-block mt-2" id="login_button" type="submit">Login</button>
                    <a href="/password/reset"><button class="btn btn-sm btn-secondary btn-block" id="forgotten_password" type="button">Forgotten Password</button></a>
                </form>
            </div>
        </div>
    </div>
@endguest


<div id="content">
    @yield('content')
</div>
</body>
</html>
