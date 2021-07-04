@extends('templates._calendar')

@push('head')
    <script>

    $(document).ready(function(){

        @include('calendar._loadcalendar')

        preview_date = clone(dynamic_data);
        preview_date.follow = true;

        static_data.settings.layout = "minimalistic";
        static_data.settings.show_current_month = true;

        rebuild_calendar('mini_page', dynamic_data);

    });

    </script>
@endpush

@section('content')
    <div id="generator_container">
        @include('layouts.calendar-single-month'))
    </div>
@endsection
