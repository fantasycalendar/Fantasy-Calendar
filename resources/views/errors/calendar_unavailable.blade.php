@extends('errors.error')

@section('content')
    <div class="site">
        <div class="sketch">
            <div class="bee-sketch red"></div>
            <div class="bee-sketch blue"></div>
        </div>

        <h1><small>{{ $title ?? "This calendar is unavailable" }}</small></h1>
    </div>
@endsection
