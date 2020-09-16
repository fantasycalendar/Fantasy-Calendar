@extends('templates._page')

@push('head')
    <style>
        .subscription-option .inner {
            padding: 1.5rem .5rem;
            display: flex;
            flex-direction: column;
            position: relative;
            text-align: center;
            /*box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.25);*/
            border-radius: 8px;
            border: 1px solid rgba(0, 0, 0, 0.08);
        }
        .subscription-option .inner > * {
            padding-left: 1.2rem;
            padding-right: 1.2rem;
        }
        h2 {
            font-size: 2rem;
        }
        h3 {
            padding: .5rem 0;
        }
        h5 {
            font-size: 0.7rem;
            color: #757575;
            min-height: 3.5rem;
            display: inline-block;
            padding-top: 0.3rem;
        }
        ul.features {
            margin: 0 0 2rem 0;
            line-height: 1.5rem;
            list-style-type: none;
        }
        a.btn, a.register {
            display: inline-block;
            width: 95%;
            margin: auto;
            margin-bottom: initial;
        }
        a.disabled {
            content: 'You are subscribed!';
            background-color: grey;
        }
        .small {
            font-size: .6rem;
            line-height: .8rem;
            margin: 0;
        }
        .container {
            padding-top: 3rem;
            max-width: 980px;
        }
        .custom-checkbox {
            display: inline-block;
        }
        .subscription-option:not(.yearly) .yearly {
            display: none;
        }
        .subscription-option.yearly .monthly {
            display: none;
        }
        .price-label {
            margin: 48px 0;
        }
    </style>
@endpush

@section('content')

    <div class="container py-4 pb-md-5" x-data="{ yearly: false }">
        <h1 class="center-text mb-4">Subscribe to Fantasy Calendar</h1>

        @if(session()->has('alert'))
            <div class="alert alert-info py-3 m-4">{{ session('alert') }}</div>
        @endif

    @if(!$betaAccess || Auth::user()->paymentLevel() == "Free")
        @elseif($betaAccess)
            <div class="row">
                <div class="col-12">
                    <div class="alert alert-warning">
                        As a beta user, you already have the Timekeeper tier -  If you just want to show us some love, you can choose to <a href="{{ route('subscription.pricing', ['beta_override' => true]) }}"> subscribe anyway</a> for a discounted price!.
                    </div>
                </div>
            </div>
        @else
            <div class="row">
                <div class="col-12">
                    <div class="alert alert-warning">
                        You are already subscribed to Fantasy Calendar - You'll need to <a href="{{ route('subscription.cancel') }}">cancel your subscription</a> if you want to pick a different subscription option.
                    </div>
                </div>
            </div>
        @endif

        <div class="row py-3 py-md-4 my-lg-4">
            <div class="col-12 col-lg-8 d-flex flex-column justify-content-center">
                <h3>What subscribing gets you</h3>

                <ul class="text-left">
                    <li><strong>Full</strong> calendar functionality</li>
                    <li><strong>Unlimited</strong> calendars in list</li>
                    <li><strong>User Management</strong> <p class="small">Users can comment on events and view provided information</p> </li>
                    <li>Calendar <strong>co-ownership</strong> <p class="small">Co-owners can comment on events, create events, and change the current date.</p></li>
                    <li>Calendar Linking <p class="small">Link calendars together and drive their dates from a single parent calendar!</p></li>
                </ul>

            </div>


            <div class="col-12 col-lg-4 subscription-option" :class="{yearly: yearly}">
                <div class="inner">
                    <div class="row">
                        <div class="col-12 text-center py-2">
                            <span>Monthly</span>
                            <label class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="#interval_selection" @click="yearly = !yearly">
                                <span class="custom-control-indicator"></span>
                            </label>
                            <span>Yearly</span>
                        </div>
                    </div>

                    @if($betaAccess && Auth::user()->paymentLevel() == "Free")
                        <div class="price-label">
                            <h3>Free<br></h3><p class="small">Because you're awesome <3</p>
                        </div>
                    @elseif($earlySupporter)
                        <div class="price-label" x-show="!yearly">
                            <h2>$1.99<span class="small">/mo</span><br></h2>
                            <p><strong>20% off</strong> early supporter discount<br>(normally $2.49)!</p>
                        </div>
                        <div class="price-label" x-show="yearly">
                            <h2>$19.99<span class="small">/yr</span><br></h2>
                            <p><strong>20% off</strong> early supporter discount<br>(normally $24.99), as well as two months free!</p>
                        </div>
                    @else
                        <div class="price-label" x-show="!yearly">
                            <h3>$2.49<span class="small">/mo</span><br></h3>
                        </div>
                        <div class="price-label" x-show="yearly">
                            <h3>$24.99<span class="small">/yr</span><br></h3>
                            <p>Two months free (16% discount)!</p>
                        </div>
                    @endif


                    @guest
                        <a href="{{ route('register') }}" class="register">Register to subscribe</a>
                    @else
                        @if(!$betaAccess)
                            @if(!$betaAccess && Auth::user()->subscribedToPlan('timekeeper_monthly', 'Timekeeper'))
                                @if(Auth::user()->subscriptions->first()->onGracePeriod())
                                    <a href="{{ route('subscription.resume', ['level' => 'Timekeeper']) }}" class="btn btn-info" x-show="yearly">Resume monthly</a>
                                @else
                                    <a href="{{ route('profile') }}" class="btn btn-primary monthly">View your subscription</a>
                                @endif
                            @else
                                <a @unless($subscribed) href="{{ route('subscription.subscribe', ['level' => 'Timekeeper', 'interval' => 'monthly']) }}" @else href="javascript:" @endunless @if($subscribed) onclick="swal('info','This doesn\'t work yet, you\'ll need to cancel and re-subscribe to change plans.', 'info')" @endif class="btn btn-primary subscribe monthly">{{ $subscribed ? 'Switch to' : 'Subscribe' }} Monthly</a>
                            @endif

                            @if(!$betaAccess && Auth::user()->subscribedToPlan('timekeeper_yearly', 'Timekeeper'))
                                    @if(Auth::user()->subscriptions->first()->onGracePeriod())
                                        <a href="{{ route('subscription.resume', ['level' => 'Timekeeper']) }}" class="btn btn-info" x-show="!yearly">Resume yearly</a>
                                    @else
                                        <a href="{{ route('profile') }}" class="btn btn-primary monthly">View your subscription</a>
                                    @endif
                            @else
                                <a @unless($subscribed) href="{{ route('subscription.subscribe', ['level' => 'Timekeeper', 'interval' => 'yearly']) }}" @else href="javascript:" @endunless @if($subscribed) onclick="swal('info','This doesn\'t work yet, you\'ll need to cancel and re-subscribe to change plans.', 'info')" @endif class="btn btn-primary subscribe yearly">{{ $subscribed ? 'Switch to' : 'Subscribe' }} Yearly</a>
                            @endif
                        @else
                            <a href="{{ route('profile') }}" class="btn btn-primary monthly">View your subscription</a>
                        @endif
                    @endguest
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-2"></div>
            <div class="col-12 col-lg-8 text-center my-4 py-3 px-4 border rounded" style="opacity: 0.65;">
                <small>Have you donated to Fantasy Calendar in the past? If so, we'd love to give you a subscription! Please <a href="mailto:contact@fantasy-calendar.com">contact us</a> with proof of your donation, so we can make that happen.</small>
            </div>
            <div class="col-lg-2"></div>
        </div>
    </div>
@endsection
