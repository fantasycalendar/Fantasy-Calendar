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

        <h1 class="pt-5">What's Changed with Fantasy Calendar</h1>

        {!! Markdown::convertToHtml(Storage::disk('base')->get('public/changelog.md')); !!}

    </div>
@endsection
