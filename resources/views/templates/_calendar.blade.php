<!DOCTYPE HTML>

<html lang="en">
    @include('templates._head_content')

    <body class="@guest dark @else @setting('dark_theme') dark @endsetting @endguest page-{{ str_replace('.', '-', Route::currentRouteName()) }} @stack('page-class')"
        x-data="Viewport"
        @open-sidebar.window="open_sidebar"
        @close-sidebar.window="close_sidebar"
        @calendar-validation-failed.window="add_errors"
        @calendar-validation-succeeded.window="remove_errors"
        @display-redraw-warning.window='display_redraw_warning'
        @hide-redraw-warning.window='hide_redraw_warning'
        @keydown.ctrl.slash.window='toggle_sidebar'
        >

        <div id="content">
            <x-loading-background></x-loading-background>
            @yield('content')
        </div>

        <x-notification-area />
        <x-context-menu />
    </body>
</html>
