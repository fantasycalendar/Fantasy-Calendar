@extends('templates._page')

@section('profile-card')
    <div class="row">
        <div class="col-6">
            <p><i class="fa fa-calendar"></i> Calendars: {{ $user->calendars->count() }}</p>
        </div>
        <div class="col-6">
            <p><i class="fa fa-layer-group"></i> Subscription: {!! ($user->betaAccess()) ? "Worldbuilder <br><small class='pl-3'>(Free for beta participation)</small>" : $user->paymentLevel() !!}</p>
            @empty($subscription)
                @unless($user->betaAccess())
                    <p><a class="btn btn-primary form-control" href="{{ route('subscription.pricing') }}">Get subscribed</a></p>
                @else
                    <p><a href="{{ route('subscription.pricing', ['beta_override' => '1']) }}" class="btn btn-primary form-control">Subscribe anyway</a></p>
                @endunless
            @else
                @if($subscription->onGracePeriod())
                    <p style="color: red;"><i class="fa fa-exclamation-triangle"></i> Cancelled, ending {{ $subscription->ends_at->format('Y-m-d') }}</p>
                @endif
                <p><i class="fa fa-credit-card"></i> {{ strtoupper($user->card_brand) }} (...{{ $user->card_last_four }})</p>
                <p><a class="btn btn-primary form-control" href="{{ route('subscription.pricing') }}">Change subscription</a></p>
                @if($subscription->onGracePeriod())
                    <p><a href="{{ route('subscription.cancel') }}" class="btn btn-danger form-control">Immediately end benefits</a></p>
                @else
                    <p><a href="{{ route('subscription.cancel') }}" class="btn btn-danger form-control">Cancel subscription</a></p>
                @endif
            @endunless
        </div>
    </div>
@endsection

@section('profile-card-header')
    User information
@endsection

@section('content')
    <div class="container">
        <div class="row py-5">
            <div class="col-12 col-md-4">
                <div class="card">
                    <div class="card-header">{{ $user->username }}</div>
                    <div class="card-body">
                        <div class="card-text">
                            <p><a href="mailto:{{ $user->email }}"><i class="fa fa-envelope"></i> {{ $user->email }}</a></p>
                            <p>Registered {{ $user->created_at->format('Y-m-d') }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-8">
                <div class="card">
                    <div class="card-header">@yield('profile-card-header')</div>
                    <div class="card-body">
                        <div class="card-text">
                            @yield('profile-card')
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
