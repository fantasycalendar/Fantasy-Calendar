@extends('templates._error', ['title' => (isset($title) ? $title : '404 - Page Not Found')])

@section('content')
    <div class="container py-5 px-3 error-container">
        <div class="row w-100">
            <div class="d-none d-lg-flex col-lg-5 flex-column justify-content-center">
                <div class="sketch">
                    <div class="bee-sketch red"></div>
                    <div class="bee-sketch blue"></div>
                </div>
            </div>
            <div class="col-12 col-lg-7 d-flex flex-column justify-content-center">
                <h1>404:<small>{{ isset($resource) ? $resource : "Page" }} Not Found</small></h1>
            </div>
        </div>
    </div>
@endsection
