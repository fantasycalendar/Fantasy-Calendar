<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="description" content="All-in-One Fantasy Calendar Generator - Creation of calendars and time-tracking in your homebrew or pre-made campaign worlds have never been easier!">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @if(Auth::check())
        <meta name='api-token' content="{{ Auth::user()->api_token }}">
    @endif

    <title>
        {!! ($title ?? $calendar->name ?? "Fantasy Calendar") . ' -' !!} Fantasy Calendar
    </title>

    <link rel="apple-touch-icon" sizes="180x180" href="/resources/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/resources/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/resources/favicon-16x16.png">
    <link rel="manifest" href="/resources/site.webmanifest">
    <link rel="mask-icon" href="/resources/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.17.0/dist/jquery.validate.min.js"></script>
    <script src="https://rawgit.com/notifyjs/notifyjs/master/dist/notify.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>

    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
    <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css" />
    <script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/3.2.1/css/font-awesome.min.css">

    <script>

    window.baseurl = '{{ getenv('WEBADDRESS') }}';
    window.apiurl = '{{ getenv('WEBADDRESS') }}'+'api/calendar';

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'Authorization': 'Bearer '+$('meta[name="api-token"]').attr('content')
        }
    });

    $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
        $.notify(thrownError + " (F12 to see more detail)");
    });

    $(document).ready(function(){
        window.onerror = function(error, url, line) {
            $.notify("Error:\n "+error+" \nin file "+url+" \non line "+line);
        }
    });

    </script>

    <script src="/js/login.js"></script>

    <script src="/js/vendor/chartjs/Chart.min.js"></script>
    <script src="/js/vendor/trumbowyg/trumbowyg.min.js"></script>
    <script src="/js/vendor/jquery/jquery.ui.touch-punch.min.js"></script>
    <script src="/js/vendor/notifyjs/notify.min.js"></script>
    <script src="/js/vendor/sortable/jquery-sortable-min.js"></script>
    <script src="/js/vendor/spectrum/spectrum.js"></script>

    <script src="{{ mix('/js/calendar/header.js') }}"></script>
    <script src="{{ mix('/js/calendar/calendar_ajax_functions.js') }}"></script>
    <script src="{{ mix('/js/calendar/calendar_event_ui.js') }}"></script>
    <script src="{{ mix('/js/calendar/calendar_functions.js') }}"></script>
    <script src="{{ mix('/js/calendar/calendar_variables.js') }}"></script>
    <script src="{{ mix('/js/calendar/calendar_weather_layout.js') }}"></script>
    <script src="{{ mix('/js/calendar/calendar_season_generator.js') }}"></script>
    <script src="{{ mix('/js/calendar/calendar_layout_builder.js') }}"></script>
    <script src="{{ mix('/js/calendar/calendar_inputs_visitor.js') }}"></script>
    <script src="{{ mix('/js/calendar/calendar_inputs_view.js') }}"></script>
    <script src="{{ mix('/js/calendar/calendar_inputs_edit.js') }}"></script>
    <script src="{{ mix('/js/calendar/calendar_manager.js') }}"></script>
    <script src="{{ mix('/js/calendar/calendar_presets.js') }}"></script>

    <link rel="stylesheet" href="{{ mix('/css/calendar_input_style.css') }}">
    <link rel="stylesheet" href="{{ mix('/css/calendar_styles.css') }}">
    <link rel="stylesheet" href="{{ mix('/css/index_style.css') }}">
    <link rel="stylesheet" href="{{ mix('/css/login_style.css') }}">
    <link rel="stylesheet" href="{{ mix('/css/header_style.css') }}">
    <link rel="stylesheet" href="{{ mix('/css/text_styles.css') }}">
    <link rel="stylesheet" href="/js/vendor/spectrum/spectrum.css">
    <link rel="stylesheet" href="/js/vendor/trumbowyg/ui/trumbowyg.min.css">

    @stack('head')
</head>
