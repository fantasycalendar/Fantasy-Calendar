@extends('templates._page')

@push('head')
    <style>
        .subscription-option {
            padding-top: 20px;
        }
        .subscription-option .inner {
            padding: .5rem 0;
            display: flex;
            flex-direction: column;
            position: relative;
            text-align: center;
            box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.25);
            border-radius: 5px;
            height: 100%;
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
    </style>
@endpush

@section('content')

    <div class="container py-4">
        <h1 class="center-text">Subscribe to Fantasy Calendar</h1>

        @if(session()->has('alert'))
            <div class="alert alert-info py-3 m-5">{{ session('alert') }}</div>
        @endif

    @if(!$betaAccess || Auth::user()->paymentLevel() == "Free")
        <div class="row">
            <div class="col-12 center-text py-2">
                <span>Monthly</span>
                <label class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="#interval_selection" onclick="$('.subscription-option').toggleClass('yearly');">
                    <span class="custom-control-indicator"></span>
                </label>
                <span>Yearly</span>
            </div>
        </div>
        @elseif(Auth::user()->subscriptions->first() && !Auth::user()->subscriptions->first()->onGracePeriod())
            <div class="row">
                <div class="col-12">
                    <div class="alert alert-warning">
                        You are already subscribed to Fantasy Calendar - You'll need to <a href="{{ route('subscription.cancel') }}">cancel your subscription</a> if you want to pick a different subscription option.
                    </div>
                </div>
            </div>
        @endif

        <div class="row">
            <div class="col-12 col-lg-4 subscription-option">
                <div class="inner">
                    <h2>Free</h2>
                    <h5>For users who just need to keep track of some basic stuff.</h5>
                    <h3 class="bg-grey">Free</h3>
                    <ul class="features">
                        <li><strong>Full</strong> calendar functionality</li>
                        <li>Maximum of <strong>2</strong> calendars</li>
                    </ul>
                    @guest
                        <a href="{{ route('register') }}" class="btn btn-primary">Register now</a>
                    @else
                        @if(!$betaAccess)
                            @unless($subscribed && !Auth::user()->subscriptions->first()->onGracePeriod())
                                <a href="#" class="btn btn-secondary disabled">You already have this!</a>
                            @else
                                <a href="{{ route('subscription.cancel') }}" class="btn btn-danger">Cancel Subscription</a>
                            @endunless
                        @endif
                    @endguest
                </div>
            </div>

            <div class="col-12 col-lg-4 subscription-option">
                <div class="inner">
                    <h2>Timekeeper</h2>
                    <h5>For users who need to keep track of multiple timelines, universes, or games.</h5>

                    @if($betaAccess && Auth::user()->paymentLevel() == "Free")
                        <h3 class="bg-grey monthly">Free<br><p class="small">Because you're awesome <3</p></h3>
                        <h3 class="bg-grey yearly">Free<br><p class="small">Because you're awesome <3</p></h3>
                    @elseif($earlySupporter)
                        <h3 class="bg-grey monthly">$1.49 / month<br><p class="small">25% off because you're an early supporter (normally $1.99)!</p></h3>
                        <h3 class="bg-grey yearly">$14.99 / year<br><p class="small">25% off because you're an early supporter (normally $19.99), as well as two months free!</p></h3>
                    @else
                        <h3 class="bg-grey monthly">$1.99 / month<br></h3>
                        <h3 class="bg-grey yearly">$19.99 / year<br><p class="small">Two months free (16% discount)!</p></h3>
                    @endif

                    <ul class="features">
                        <li><strong>Full</strong> calendar functionality</li>
                        <li><strong>Unlimited</strong> number of calendars</li>
                        <li>Icon next to your username</li>
                        <li>Timekeeper Discord role</li>
                        <li>Subscriber-only Discord channel</li>
                        <li><strong>User Management</strong> <p class="small">Users can comment on events and view provided information</p> </li>
                    </ul>

                    @guest
                        <a href="{{ route('register') }}" class="register">Register to subscribe</a>
                    @else
                        @if(!$betaAccess)
                            @if(Auth::user()->subscribedToPlan('timekeeper_monthly', 'Timekeeper'))
                                @if(Auth::user()->subscriptions->first()->onGracePeriod())
                                    <a href="{{ route('subscription.resume', ['level' => 'Timekeeper']) }}" class="btn btn-info monthly">Resume monthly</a>
                                @else
                                    <a href="{{ route('profile') }}" class="btn btn-primary monthly">View your subscription</a>
                                @endif
                            @else
                                <a @unless($subscribed) href="{{ route('subscription.subscribe', ['level' => 'Timekeeper', 'interval' => 'monthly']) }}" @else href="javascript:" @endunless @if($subscribed) onclick="swal('info','This doesn\'t work yet, you\'ll need to cancel and re-subscribe to change plans.', 'info')" @endif class="btn btn-primary subscribe monthly">{{ $subscribed ? 'Switch to' : 'Subscribe' }} Monthly</a>
                            @endif

                            @if(Auth::user()->subscribedToPlan('timekeeper_yearly', 'Timekeeper'))
                                    @if(Auth::user()->subscriptions->first()->onGracePeriod())
                                        <a href="{{ route('subscription.resume', ['level' => 'Timekeeper']) }}" class="btn btn-info yearly">Resume yearly</a>
                                    @else
                                        <a href="{{ route('profile') }}" class="btn btn-primary monthly">View your subscription</a>
                                    @endif
                            @else
                                <a @unless($subscribed) href="{{ route('subscription.subscribe', ['level' => 'Timekeeper', 'interval' => 'yearly']) }}" @else href="javascript:" @endunless @if($subscribed) onclick="swal('info','This doesn\'t work yet, you\'ll need to cancel and re-subscribe to change plans.', 'info')" @endif class="btn btn-primary subscribe yearly">{{ $subscribed ? 'Switch to' : 'Subscribe' }} Yearly</a>
                            @endif
                        @endif
                    @endguest
                </div>
            </div>

            <div class="col-12 col-lg-4 subscription-option">
                <div class="inner">
                    <h2>Worldbuilder</h2>
                    <h5>For power users who want to collaborate using the greatest multi-user fantasy calendar tool on the market.</h5>

                    @if($betaAccess && Auth::user()->paymentLevel() == "Free")
                        <h3 class="bg-grey monthly">Free<br><p class="small">Because you're awesome <3</p></h3>
                        <h3 class="bg-grey yearly">Free<br><p class="small">Because you're awesome <3</p></h3>
                    @elseif($earlySupporter)
                        <h3 class="bg-grey monthly">$2.24 / month<br><p class="small">25% off because you're an early supporter (normally $2.99)!</p></h3>
                        <h3 class="bg-grey yearly">$22.49 / year<br><p class="small">25% off because you're an early supporter (normally $29.99), as well as two months free!</p></h3>
                    @else
                        <h3 class="bg-grey monthly">$2.99 / month<br></h3>
                        <h3 class="bg-grey yearly">$29.99 / year<br><p class="small">Two months free (16% discount)!</p></h3>
                    @endif

                    <ul class="features">
                        <li><strong>Full</strong> calendar functionality</li>
                        <li><strong>Unlimited</strong> number of calendars</li>
                        <li>Icon next to your username</li>
                        <li>Worldbuilder Discord role</li>
                        <li>Subscriber-only Discord channel</li>
                        <li><strong>User Management</strong> <p class="small">Users can comment on events and view provided information</p> </li>
                        <li>Calendar <strong>co-ownership</strong> <p class="small">Co-owners can comment on events, create events, and change the current date.</p></li>
                        <li>Calendar Linking <p class="small">Link calendars together and drive their dates from a single parent calendar!</p></li>
                    </ul>

                    @guest
                        <a href="{{ route('register') }}" class="register">Register to subscribe</a>
                    @else
                        @if(!$betaAccess)
                            @if(!$betaAccess && Auth::user()->subscribedToPlan('worldbuilder_monthly', 'Worldbuilder'))
                                @if(Auth::user()->subscriptions->first()->onGracePeriod())
                                    <a href="{{ route('subscription.resume', ['level' => 'Worldbuilder']) }}" class="btn btn-info monthly">Resume monthly</a>
                                @else
                                    <a href="{{ route('profile') }}" class="btn btn-primary monthly">View your subscription</a>
                                @endif
                            @else
                                <a @unless($subscribed) href="{{ route('subscription.subscribe', ['level' => 'Worldbuilder', 'interval' => 'monthly']) }}" @else href="javascript:" @endunless @if($subscribed) onclick="swal('info','This doesn\'t work yet, you\'ll need to cancel and re-subscribe to change plans.', 'info')" @endif class="btn btn-primary subscribe monthly">{{ $subscribed ? 'Switch to' : 'Subscribe' }} Monthly</a>
                            @endif

                            @if(!$betaAccess && Auth::user()->subscribedToPlan('worldbuilder_yearly', 'Worldbuilder'))
                                    @if(Auth::user()->subscriptions->first()->onGracePeriod())
                                        <a href="{{ route('subscription.resume', ['level' => 'Worldbuilder']) }}" class="btn btn-info yearly">Resume yearly</a>
                                    @else
                                        <a href="{{ route('profile') }}" class="btn btn-primary monthly">View your subscription</a>
                                    @endif
                            @else
                                <a @unless($subscribed) href="{{ route('subscription.subscribe', ['level' => 'Worldbuilder', 'interval' => 'yearly']) }}" @else href="javascript:" @endunless @if($subscribed) onclick="swal('info','This doesn\'t work yet, you\'ll need to cancel and re-subscribe to change plans.', 'info')" @endif class="btn btn-primary subscribe yearly">{{ $subscribed ? 'Switch to' : 'Subscribe' }} Yearly</a>
                            @endif
                        @else
                            <a href="{{ route('profile') }}" class="btn btn-primary monthly">View your subscription</a>
                        @endif
                    @endguest
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-2"></div>
            <div class="col-12 col-md-8 text-center my-5 py-3 px-4 border rounded" style="opacity: 0.65;">
                <small>Have you donated to Fantasy Calendar in the past? If so, we'd love to give you an appropriate subscription! Please <a href="mailto:contact@fantasy-calendar.com">contact us</a> with proof of your donation so we can make that happen.</small>
            </div>
            <div class="col-md-2"></div>
        </div>
    </div>
@endsection
