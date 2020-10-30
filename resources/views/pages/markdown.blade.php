@extends('templates._page')

@push('head')
    <style>
        html {
            scroll-behavior: smooth;
        }
        html>/**/body ol { /* Won't be interpreted by IE6/7. */
            counter-reset: level1;
        }

        li {
            position: relative;
            padding-bottom: 4px;
        }

        li:before {
            position: absolute;
            width: 34px;
            left: -38px;
            text-align: right;
            font-size: 95%;
        }

        .markdown_container ol p {
            margin-bottom:0rem;
        }

        .markdown_container > div > ol > li{
            margin-bottom:1rem;
        }

        .markdown_container ol li:before {
            content: "";
            counter-increment: level1;
        }
        .markdown_container ol li ol {
            list-style-type: none;
            counter-reset: level2;
        }
        .markdown_container ol li ol li:before {
            content: counter(level1) "." counter(level2) " ";
            counter-increment: level2;
        }
        .markdown_container ol ol ol li:before {
            content: "";
            counter-increment: "";
        }
        .markdown_container ol ol ol > li {
            list-style-type: lower-alpha;
        }

        .table {
            margin: 4px 0;
        }
    </style>
@endpush

@section('content')
    <div class="container markdown_container">

        <div class="py-5">

            <h1>{{ $title }}</h1>
            <p><i>Document Version {{ $version }}.0 — {{ $date }}</i></p>

            {!! $markdown !!}

        </div>

    </div>
@endsection
