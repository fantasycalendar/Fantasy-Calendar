@extends('errors.error', ['title' => (isset($title) ? $title : '404 - Page Not Found')])

@section('content')
    <div class="site">
        <div class="sketch">
            <div class="bee-sketch red"></div>
            <div class="bee-sketch blue"></div>
        </div>

        <h1>404:<small>{{ isset($resource) ? $resource : "Page" }} Not Found</small></h1>
    </div>
@endsection
