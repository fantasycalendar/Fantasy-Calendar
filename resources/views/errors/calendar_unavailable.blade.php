@extends('errors.error')

@section('content')
    <div class="container py-5 px-3 error-container">
        <div class="row">
            <div class="d-none d-lg-flex col-lg-5 flex-column justify-content-center">
                <div class="sketch">
                    <div class="bee-sketch red"></div>
                    <div class="bee-sketch blue"></div>
                </div>
            </div>

            <div class="col-12 col-lg-7 d-flex flex-column justify-content-center">
                <h1>{{ $title ?? "That calendar is unavailable." }}</h1>
            </div>
        </div>
    </div>
@endsection
