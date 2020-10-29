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
            <p><i>Document Version {{ $version }}.0 — {{ $date }}</i></p>

            {!! $markdown !!}

        </div>

    </div>
@endsection
