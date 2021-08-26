@extends('templates._page')

@push('head')
    <style>
        @import url('https://fonts.googleapis.com/css?family=Cabin+Sketch');


        h1 {
            font-size: 3em;
            text-align: center;
            opacity: .8;
            order: 1;
        }

        h1, h2 {
            font-family: 'Cabin Sketch', cursive;
        }

        #content {
            height: 100%;
            display: grid;
            place-items: center;
            text-align: center;
        }
    </style>
@endpush

@section('content')
    <div class="container py-5 error-container">
        <h1>Fantasy Calendar is down for maintenance.</h1>
        <h2>{{ json_decode(Cache::get(config('app.maintenance_key')), true)['message'] ?? "We'll be right back." }}</h2>
    </div>
@endsection
