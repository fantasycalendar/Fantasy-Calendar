@extends('templates._page')

@section('content')
    <div class="container">
        <div class="row">
            @forelse ($subscriptions as $subscription)
                <div class="subscription">
                    <h2>You're subscribed to {{ $subscription->name }}</h2>
                    @if($subscription->onGracePeriod())
                        <p>You've cancelled your subscription, ending on {{ $subscription->ends_at->format('Y-m-d') }}</p>

                        <a class="btn btn-danger" href="javascript:" onclick="axios.post('{{ route('subscription.cancel', ['level' => $subscription->name]) }}').then(location.reload())">Cancel it for good</a>

                        <a class="btn btn-primary" href="{{ route('subscription.resume', ['level' => $subscription->name]) }}">Resume your subscription</a>
                    @else
                        <p>Your subscription is active, as of {{ $subscription->created_at->format('Y-m-d') }}!</p>

                        <a class="btn btn-danger" href="javascript:" onclick="axios.post('{{ route('subscription.cancel', ['level' => $subscription->name]) }}').then(location.reload())">Cancel my subscription</a>
                    @endif
                </div>
            @empty
                <h1>You're not subscribed to any plans!</h1>
            @endforelse
        </div>
    </div>
@endsection
