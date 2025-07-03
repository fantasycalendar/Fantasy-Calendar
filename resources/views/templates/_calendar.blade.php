<!DOCTYPE HTML>

<html lang="en">
    @include('templates._head_content')

    <body class="@guest dark @else @setting('dark_theme') dark @endsetting @endguest page-{{ str_replace('.', '-', Route::currentRouteName()) }} @stack('page-class')" x-data="MainApp" @toggle_sidebar.window="window.toggle_sidebar($event.detail.force ?? false)">
        <div id="protip_container" class='d-print-none'></div>

        <div id="content">
            <x-loading-background></x-loading-background>

            @yield('content')

            @env(['development'])
                <script>
                    // $(document).ready(function() {
                    //     $.notify("This is the beta deployment of Fantasy Calendar. Use with caution.", {autoHide: false});
                    // });
                </script>
            @endenv
        </div>

        <x-notification-area />
        <x-context-menu />
    </body>
</html>
