<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="description" content="All-in-One Fantasy Calendar Generator - Creation of calendars and time-tracking in your homebrew or pre-made campaign worlds has never been easier!">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta property="og:title" content="{{ $calendar->name ?? $title ?? "Fantasy Calendar" }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->full() }}">
    <meta property="og:image" content="{{ url('/resources/logo_discord.jpg') }}">
    <meta property="og:description" content="All-in-One Fantasy Calendar Generator - Creation of calendars and time-tracking in your homebrew or pre-made campaign worlds has never been easier!">

    @if(Auth::check())
        <meta name='api-token' content="{{ Auth::user()->api_token }}">
    @endif

    <title>
        {!! ($title ?? $calendar->name ?? "Fantasy Calendar") . ' -' !!} Fantasy Calendar
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


    @vite('resources/js/jquery.js')
    @vite('resources/js/app.js')

    <!-- <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css"> -->
    <!-- <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script> -->

    <!-- <script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.17.0/dist/jquery.validate.min.js"></script> -->
    <!-- <script src="https://rawgit.com/notifyjs/notifyjs/master/dist/notify.js"></script> -->

    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script> -->

    <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css" />
    <script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>

    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/3.2.1/css/font-awesome.min.css"> -->

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

    <!-- <script src="{{ asset("/js/vendor/sortable/jquery-sortable-min.js") }}"></script> -->
    <!-- <script src="{{ asset("/js/vendor/spectrum/spectrum.js") }}"></script> -->

    <!-- <script src="{{ mix('js/calendar/header.js') }}"></script> -->
    <!-- <script src="{{ mix('js/calendar/calendar_ajax_functions.js') }}"></script> -->
    <!-- <script src="{{ mix('js/calendar/calendar_functions.js') }}"></script> -->
    <!-- <script src="{{ mix('js/calendar/calendar_variables.js') }}"></script> -->
    <!-- <script src="{{ mix('js/calendar/calendar_weather_layout.js') }}"></script> -->
    <!-- <script src="{{ mix('js/calendar/calendar_day_data_layout.js') }}"></script> -->
    <!-- <script src="{{ mix('js/calendar/calendar_season_generator.js') }}"></script> -->
    <!-- <script src="{{ mix('js/calendar/calendar_inputs_visitor.js') }}"></script> -->
    <!-- <script src="{{ mix('js/calendar/calendar_inputs_view.js') }}"></script> -->
    <!-- <script src="{{ mix('js/calendar/calendar_inputs_edit.js') }}"></script> -->
    <!-- <script src="{{ mix('js/calendar/calendar_manager.js') }}"></script> -->
    <!-- <script src="{{ mix('js/calendar/calendar_presets.js') }}"></script> -->
    <!-- <script src="{{ mix('js/calendar/calendar_workers.js') }}"></script> -->

    @if(!Auth::check() || Auth::user()->setting('dark_theme'))
        @vite('resources/sass/app-dark.scss')
    @else
        @vite('resources/sass/app.scss')
    @endif

    @stack('head')
</head>
