@extends('templates._page')

@push('head')
    <script>
    const owner = "{{ $calendar->owned }}";

    $(document).ready(function() {
        wizard = false;

        hash = "{{ $calendar->hash }}";

        calendar_name = "{{ $calendar->name }}";
        static_data = {!! json_encode($calendar->static_data) !!};
        dynamic_data = {!! json_encode($calendar->dynamic_data) !!};
        link_data = {
            master_hash: "{{ $calendar->master_hash }}",
            children: {{ $calendar->children }}
        };

        last_static_change = new Date("{{ $calendar->last_static_change }}")
        last_dynamic_change = new Date("{{ $calendar->last_dynamic_change }}")

        set_up_edit_inputs(true);
        bind_calendar_events();
        rebuild_calendar('calendar', dynamic_data);

        edit_event_ui.bind_events();
        edit_HTML_ui.bind_events();
    })
    </script>
@endpush

@section('content')
    <div id="generator_container">
        @include('layouts.weather_tooltip')
        @include('layouts.event')
        @include('inputs.sidebar.edit')
    </div>
@endsection