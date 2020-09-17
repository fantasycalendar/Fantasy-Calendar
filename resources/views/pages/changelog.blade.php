@extends('templates._page')

@push('head')
    <style>

        html {
            scroll-behavior: smooth;
        }

        .changelog__content {
            padding: 1rem;
        }

    </style>
@endpush

@section('content')

    <div class="changelog__content">
        
        <h1 class="pt-5">Changelog</h1>

        {!! Markdown::convertToHtml(Storage::disk('base')->get('public/changelog.md')); !!}

    </div>
@endsection
