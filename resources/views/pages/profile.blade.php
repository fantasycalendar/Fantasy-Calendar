@extends('templates._page')

@push('head')
    <script>
        function toggleSetting(name) {
            document.getElementById(name).value=1-document.getElementById(name).value;
            if(document.getElementById(name+'_input').getAttribute('checked') === 'checked') {
                document.getElementById(name+'_input').removeAttribute('checked');
            } else {
                document.getElementById(name+'_input').setAttribute('checked', 'checked');
            }
        }
    </script>
@endpush

@section('profile-card')
    <div class="row">
        <div class="col-12 col-md-4">
            <p><i class="fa fa-calendar"></i> Calendars: {{ $user->calendars->count() }}</p>
        </div>
        <div class="col-12 col-md-8">
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
                <p><button class="btn btn-outline-secondary form-control change-sub" disabled>Change subscription (Currently Unavailable)</button></p>
                @unless($subscription->onGracePeriod())
                    <p><a href="{{ route('subscription.cancel') }}" class="btn btn-danger form-control">Cancel subscription</a></p>
                @endunless

                @if(env('APP_ENV') !== 'production' && $subscription->onGracePeriod())
                        <p><a href="{{ route('subscription.cancel') }}" class="btn btn-danger form-control">Immediately end benefits</a></p>
                @endif
            @endunless
        </div>
    </div>
    <hr>
    <div class="row">
        <div class="col-12"><h5>User Settings</h5></div>
        <div class="col-12">
            <form id="settings" method="post">
                @csrf

                <div class="form-check pb-2" onclick="toggleSetting('dark_theme')">
                    <input id="dark_theme" type="hidden" name="dark_theme" @if(isset($user->settings['dark_theme']) && $user->settings['dark_theme']) value="1" @else value="0" @endisset>
                    <input id="dark_theme_input" type="checkbox" class="form-check-input" id="dark_theme" @if(isset($user->settings['dark_theme']) && $user->settings['dark_theme']) checked="checked" @endisset>
                    <label class="form-check-label" for="dark_theme">Enable dark theme</label>
                </div>

                <button class="btn btn-primary float-right">Save Settings</button>
            </form>
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
                    <div class="card-header"><img class="rounded mr-1" src="{{ Gravatar::get($user->email, ['size' => 40]) }}"> {{ $user->username }}</div>
                    <div class="card-body">
                        <div class="card-text">
                            <p><a href="mailto:{{ $user->email }}"><i class="fa fa-envelope"></i>&nbsp;{{ $user->email }}</a></p>
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
