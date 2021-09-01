@extends('errors.default')

@section('content')
    <div class="site">
		<div class="sketch">
			<div class="bee-sketch red"></div>
			<div class="bee-sketch blue"></div>
		</div>

		<h1><small>{{ $title ?? session('error') ?? "Unauthorized" }}</small></h1>
	</div>
@endsection
