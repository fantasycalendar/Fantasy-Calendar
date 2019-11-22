@extends('templates._page')

@push('head')
    <script>
        var afterPost = function() {
            self.location = '/profile';
        }
    </script>
@endpush

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-12 my-4">
                <div class="card">
                    <h5 class="card-header">Cancel Subscription</h5>
                    <div class="card-body center-text">
                        <h3 class="my-2">Are you sure?</h3>

                        @foreach($subscriptions as $subscription)
                            @if($subscription->onGracePeriod())
                                <p>Your subscription <strong>IS ALREADY CANCELLED</strong> and you will not be billed again. Your subscription benefits will end on {{ $subscription->ends_at->format('Y-m-d') }}.
                                The button below will <strong>end your subscription benefits</strong>, removing all record of your billing information and payment cycle from our systems.</p>
                            @endif
                            <a href="javascript:" class="btn btn-danger cancelsubbutton my-2" onclick="$(this).attr('disabled', 'disabled'); axios.post('{{ route('subscription.cancel') }}').then(afterPost);">Yes, @if($subscription->onGracePeriod()) <strong>PERMANENTLY</strong> @endif cancel my {{ $subscription->name }} subscription @if($subscription->onGracePeriod()) EFFECTIVE IMMEDIATELY. @endif</a>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
