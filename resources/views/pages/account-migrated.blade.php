@extends("templates._page")

@push('head')
    <style>
        body {
            background-image: url('{{ asset('resources/whats-new-angle-blur-transparent.png') }}');
            background-size: cover;
            background-position: center center;
        }
        #content {
            width: 100%;
            height: 100%;
        }
        @media screen and (max-width: 768px) {
            .btn {
                width: 100%;
            }
        }
    </style>
@endpush

@section("content")

    <div class="container py-5 d-md-flex justify-content-md-center align-items-md-center h-100 w-100">
        <div class="welcome text-md-center p-5" style="background-color: ">
            <h2>Welcome to Fantasy Calendar 2.0!</h2>
            <p class="mb-5" style="opacity: 0.8;">Don't worry, your calendars are all still just where you left them, but they've been made <span>better!</span> <br>2.0 is entirely new though, which means you'll need to login again. <br>Sorry about that.</p>
            <a href="{{ route('account-migrated-acknowledge') }}" class="mb-3 btn btn-lg btn-accent text-white">Take a look to see them now!</a><br>
            <a href="{{ route('whats-new') }}" class="mb-3 btn btn-outline-secondary">What's new in 2.0?</a>
        </div>
    </div>

@endsection
