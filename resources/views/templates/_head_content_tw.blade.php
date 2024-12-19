
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="description" content="Level up your narrative - Track time in your homebrew or pre-made campaign world with the Internet's best fantasy world calendaring tool!">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta property="og:title" content="{{ $calendar->name ?? $title ?? "Fantasy Calendar" }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->full() }}">
    <meta property="og:image" content="{{ url('/resources/logo_discord.jpg') }}">
    <meta property="og:description" content="Level up your narrative - Track time in your homebrew or pre-made campaign world with the Internet's best fantasy world calendaring tool!">

    <title>
        @yield('title')

        @if($title ?? $calendar->name ?? null)
            {{ ($title ?? $calendar->name) . ' -' }} Fantasy Calendar
        @else
            Fantasy Calendar - Level up your narrative
        @endif
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

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    @auth
        <meta name='api-token' content="{{ auth()->user()->api_token }}">
    @endauth

    @if(getenv('APP_ENV') == "production")
        <script src="//d2wy8f7a9ursnm.cloudfront.net/v6/bugsnag.min.js"></script>
        <script>window.bugsnagClient = bugsnag('98440cbeef759631f3d987ab45b26a79')</script>
    @endif

    @vite('resources/js/app-tw.js')
    @feature('stripe')
        <script src="https://js.stripe.com/v3/"></script>
    @endfeature

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

    @vite('resources/sass/app-tw.css')

    @stack('head')
</head>
