<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="description" content="All-in-One Fantasy Calendar Generator - Creation of calendars and time-tracking in your homebrew or pre-made campaign worlds has never been easier!">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta property="og:title" content="{{ $calendar->name ?? $title ?? "Fantasy Calendar" }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->full() }}">
    <meta property="og:image" content="{{ Vite::asset('resources/images/logo_discord.jpg') }}">
    <meta property="og:description" content="All-in-One Fantasy Calendar Generator - Creation of calendars and time-tracking in your homebrew or pre-made campaign worlds has never been easier!">

    @if(Auth::check())
        <meta name='api-token' content="{{ Auth::user()->api_token }}">
    @endif

    <title>
        {!! ($title ?? $calendar->name ?? "Fantasy Calendar") . ' -' !!} Fantasy Calendar
    </title>

    <link rel="apple-touch-icon" sizes="180x180" href="{{ Vite::asset('resources/images/apple-touch-icon.png') }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ Vite::asset('resources/images/favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ Vite::asset('resources/images/favicon-16x16.png') }}">
    <link rel="manifest" href="{{ Vite::asset('resources/images/site.webmanifest') }}">
    <link rel="mask-icon" href="{{ Vite::asset('resources/images/safari-pinned-tab.svg') }}" color="#2f855a">
    <link rel="shortcut icon" href="{{ Vite::asset('resources/images/favicon.ico') }}">
    <meta name="apple-mobile-web-app-title" content="Fantasy Calendar">
    <meta name="application-name" content="Fantasy Calendar">
    <meta name="theme-color" content="#2f855a">

    @vite('resources/js/app.js')

    <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css" />
    <script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>

    <script>

    window.baseurl = '{{ getenv('WEBADDRESS') }}';
    window.apiurl = '{{ getenv('WEBADDRESS') }}'+'api/v1';

    function isMobile() {
        try{ document.createEvent("TouchEvent"); return true; }
        catch(e){ return false; }
    }

    function deviceType() {
        var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),screenType;
        if (isMobile()){
            if ((width <= 650 && height <= 900) || (width <= 900 && height <= 650))
                screenType = "Mobile Phone";
            else
                screenType = "Tablet";
        }
        else
            screenType = "Desktop";
        return screenType;
    }

    </script>

    @if(!Auth::check() || Auth::user()->setting('dark_theme'))
        @vite('resources/sass/app-dark.scss')
    @else
        @vite('resources/sass/app.scss')
    @endif

    @stack('head')
</head>
