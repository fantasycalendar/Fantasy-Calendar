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


    @if(getenv('APP_ENV') == "production")
        <script src="//d2wy8f7a9ursnm.cloudfront.net/v6/bugsnag.min.js"></script>
        <script>window.bugsnagClient = bugsnag('98440cbeef759631f3d987ab45b26a79')</script>
    @endif

    <script src="{{ mix('/js/app.js') }}"></script>

    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.17.0/dist/jquery.validate.min.js"></script>
    <script src="https://rawgit.com/notifyjs/notifyjs/master/dist/notify.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>

    {{-- <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.js"></script> --}}

    <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css" />
    <script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/3.2.1/css/font-awesome.min.css">

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

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'Authorization': 'Bearer '+$('meta[name="api-token"]').attr('content')
        },
        data: {
            api_token: $('meta[name="api-token"]').attr('content')
        }
    });

    $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
        if(jqxhr.status === 422) {
            return;
        }

        if(jqxhr.status === 503) {
            if(jqxhr.responseJSON.message.length > 0) {
                $.notify("Fantasy Calendar is in maintenance mode. Please try again later.\nReason: " + jqxhr.responseJSON.message);
            } else {
                $.notify("Fantasy Calendar is in maintenance mode. Please try that again later.");
            }
            return;
        }

        if(jqxhr.responseJSON.message.length > 0) {
            $.notify("Error: " + jqxhr.responseJSON.message);
        } else {
            $.notify(thrownError + " (F12 to see more detail)");
        }
    });

    $(document).ready(function(){

        window.onerror = function(error, url, line) {
            $.notify("Error:\n "+error+" \nin file "+url+" \non line "+line);
        }

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

        $.trumbowyg.svgPath = '/images/icons.svg';

        if (window.localStorage.getItem('inputs_collapsed') != null) {
            toggle_sidebar(window.localStorage.getItem('inputs_collapsed') == 'true');
        } else {
            if (deviceType() == "Mobile Phone") {
                toggle_sidebar(false);
            }
        }

        if(window.navigator.userAgent.includes("LM-G850")) {
            $("#input_container").addClass('sidebar-mobile-half');
        }

        if(window.navigator.userAgent.includes('Surface Duo') && !window.navigator.userAgent.includes('Surface Duo 2')) {
            $("#input_container").addClass('sidebar-surface-duo');
            $("#input_collapse_btn").addClass('sidebar-surface-duo');
        }

        if(window.navigator.userAgent.includes('Surface Duo 2')) {
            $("#input_container").addClass('sidebar-surface-duo-2');
            $("#input_collapse_btn").addClass('sidebar-surface-duo-2');
        }
    });

    </script>

    <script src="{{ asset("/js/vendor/sortable/jquery-sortable-min.js") }}"></script>
    <script src="{{ asset("/js/vendor/spectrum/spectrum.js") }}"></script>
    <script src="{{ asset("/js/vendor/alpine/cdn.js") }}" defer></script>

    <script src="{{ mix('js/calendar/header.js') }}"></script>
    <script src="{{ mix('js/calendar/calendar_ajax_functions.js') }}"></script>
    <script src="{{ mix('js/calendar/calendar_functions.js') }}"></script>
    <script src="{{ mix('js/calendar/calendar_variables.js') }}"></script>
    <script src="{{ mix('js/calendar/calendar_weather_layout.js') }}"></script>
    <script src="{{ mix('js/calendar/calendar_day_data_layout.js') }}"></script>
    <script src="{{ mix('js/calendar/calendar_season_generator.js') }}"></script>
    <script src="{{ mix('js/calendar/calendar_inputs_visitor.js') }}"></script>
    <script src="{{ mix('js/calendar/calendar_inputs_view.js') }}"></script>
    <script src="{{ mix('js/calendar/calendar_inputs_edit.js') }}"></script>
    <script src="{{ mix('js/calendar/calendar_manager.js') }}"></script>
    <script src="{{ mix('js/calendar/calendar_presets.js') }}"></script>
    <script src="{{ mix('js/calendar/calendar_workers.js') }}"></script>

    @if(!Auth::check() || Auth::user()->setting('dark_theme'))
        <link rel="stylesheet" href="{{ mix('css/app-dark.css') }}">
    @else
        <link rel="stylesheet" href="{{ mix('css/app.css') }}">
    @endif
    <link rel="stylesheet" href="{{ asset("/js/vendor/spectrum/spectrum.css") }}">

    @stack('head')
</head>
