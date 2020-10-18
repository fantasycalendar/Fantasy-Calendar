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

            {!! Markdown::convertToHtml($markdown); !!}

        </div>

    </div>
@endsection
