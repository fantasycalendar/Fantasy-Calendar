<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="description" content="All-in-One Fantasy Calendar Generator - Creation of calendars and time-tracking in your homebrew or pre-made campaign worlds have never been easier!">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title }}</title>

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

    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>

    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
    <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css" />
    <script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>
    

    <script>

    window.baseurl = '{{ getenv('WEBADDRESS') }}';

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    
    </script>

    <script src="/js/login.js"></script>
    <script src="/js/profile.js"></script>

    <script src="/modules/chartjs/Chart.min.js"></script>
    <script src="/modules/trumbowyg/trumbowyg.min.js"></script>
    <script src="/modules/jquery/jquery.ui.touch-punch.min.js"></script>
    <script src="/modules/notifyjs/notify.min.js"></script>
    <script src="/modules/sortable/jquery-sortable-min.js"></script>
    <script src="/modules/spectrum/spectrum.js"></script>
    <script src="/modules/calendar/js/header.js"></script>
    <script src="/modules/calendar/js/calendar_ajax_functions.js"></script>
    <script src="/modules/calendar/js/calendar_event_ui.js"></script>
    <script src="/modules/calendar/js/calendar_functions.js"></script>
    <script src="/modules/calendar/js/calendar_variables.js"></script>
    <script src="/modules/calendar/js/calendar_weather_layout.js"></script>
    <script src="/modules/calendar/js/calendar_season_generator.js"></script>
    <script src="/modules/calendar/js/calendar_layout_builder.js"></script>
    <script src="/modules/calendar/js/calendar_inputs_visitor.js"></script>
    <script src="/modules/calendar/js/calendar_inputs_view.js"></script>
    <script src="/modules/calendar/js/calendar_inputs_edit.js"></script>
    <script src="/modules/calendar/js/calendar_manager.js"></script>
    <script src="/modules/calendar/js/calendar_presets.js"></script>

    <link rel="stylesheet" href="/css/calendar_input_style.css">
    <link rel="stylesheet" href="/css/calendar_styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/3.2.1/css/font-awesome.min.css">
    <link rel="stylesheet" href="/css/index_style.css">
    <link rel="stylesheet" href="/css/login_style.css">
    <link rel="stylesheet" href="/css/header_style.css">
    <link rel="stylesheet" href="/css/text_styles.css">
    <link rel="stylesheet" href="/modules/spectrum/spectrum.css">
    <link rel="stylesheet" href="/modules/trumbowyg/ui/trumbowyg.min.css">

    @stack('head')
</head>