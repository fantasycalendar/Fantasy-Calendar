@extends('templates._page')

@push('head')
    <style>
        html {
            scroll-behavior: smooth;
        }
    </style>
@endpush

@section('content')
    <div class="container">

        <div class="py-5">

            <h1>{{ $title }}</h1>
            <p><i>{{ $date }}</i></p>

            {!! Markdown::convertToHtml($markdown); !!}

        </div>

    </div>
@endsection
