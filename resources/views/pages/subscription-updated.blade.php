@extends('templates._page')

@section('content')
    <div class="container w-50">
        <div class="row py-5">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="text-center pt-2">
                            @if(Auth::user()->hasOptedInForMarketing())
                                You're now subscribed to our marketing emails!
                            @else
                                You have successfully unsubscribed from our marketing emails
                            @endif
                        </h4>
                    </div>
                    <div class="card-body text-center">
                        @if(Auth::user()->hasOptedInForMarketing())
                            <p>Don't worry, we won't spam you. We'll only send you updates and information we think you'll actually like.</p>
                        @else
                            <p>If you didn't intend to do this, you can re-subscribe via your <a href="{{ route('profile') }}">user profile</a>.</p>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
