<!DOCTYPE HTML>

<html lang="en" style="overflow-y: hidden;">

@include('templates._head_content')

<body class="page-{{ str_replace('.', '-', Route::currentRouteName()) }} @stack('page-class')">

<div id="protip_container" class='d-print-none'></div>

<div id="content">
    <div id="loading_background" class='basic-background hidden'>
        <img class='loading_spinner' src='{{ asset("resources/icons/loader_white.png") }}'>
        <div id='loading_information_text' class='hidden bold-text'>Informational Text</div>
        <div id='loading_text' class='italics-text'>Random text</div>

        <div class="loading_bar hidden"></div>

        <div class='loading_cancel_button_container'>
            <button type='button' class='btn btn-danger full loading_cancel_button hidden'>Cancel</button>
        </div>
    </div>

    @yield('content')

    @env(['development'])
        <script>
            $(document).ready(function() {
                $.notify("This is the beta deployment of Fantasy Calendar. Use with caution.", {autoHide: false});
            });
        </script>
    @endenv
</div>
</body>
</html>
