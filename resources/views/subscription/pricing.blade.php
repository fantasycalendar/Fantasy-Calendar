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
        .bg-grey {
            background-color: #EFEFEF;
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
        }
        a.btn {
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
    <div class="container">
        <h1 class="center-text">Subscribe to Fantasy Calendar</h1>

        <div class="row">
            <div class="col-12 center-text py-4">
                <span>Monthly</span>
                <label class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input static_input" id="#interval_selection" onclick="$('.subscription-option').toggleClass('yearly');">
                    <span class="custom-control-indicator"></span>
                </label>
                <span>Yearly</span>
            </div>
        </div>

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
                        @unless($subscribed)
                            <a href="#" class="btn btn-secondary disabled">You already have this!</a>
                        @else
                            <a href="{{ route('subscription.cancel') }}" class="btn btn-danger">Cancel Subscription</a>
                        @endunless
                    @endguest
                </div>
            </div>
            <div class="col-12 col-lg-4 subscription-option">
                <div class="inner">
                    <h2>Timekeeper</h2>
                    <h5>For users who need to keep track of multiple timelines, universes, or games.</h5>
                    <h3 class="bg-grey monthly">$1.49 / month</h3>
                    <h3 class="bg-grey yearly">$14.99 / month<br><p class="small">Month and a half free!</p class=small></h3>
                    <ul class="features">
                        <li><strong>Full</strong> calendar functionality</li>
                        <li><strong>Unlimited</strong> number of calendars</li>
                        <li>Icon next to your username</li>
                        <li>Timekeeper Discord role</li>
                        <li>Subscriber-only Discord channel</li>
                    </ul>
                    @guest
                        <a href="{{ route('user.register') }}">Register to subscribe</a>
                    @else
                        @if(Auth::user()->subscribedToPlan('timekeeper_monthly', 'Timekeeper'))
                            <a href="#" class="btn btn-secondary disabled monthly">You have this!</a>
                        @else
                            <a @unless($subscribed) href="{{ route('subscription.subscribe', ['level' => 'Timekeeper', 'interval' => 'monthly']) }}" @else href="javascript:" @endunless @if($subscribed) onclick="swal('info','This doesn\'t work yet', 'info')" @endif class="btn btn-primary subscribe monthly">{{ $subscribed ? 'Switch to' : 'Subscribe' }} Monthly</a>
                        @endif

                        @if(Auth::user()->subscribedToPlan('timekeeper_yearly', 'Timekeeper'))
                            <a href="#" class="btn btn-secondary disabled yearly">You have this!</a>
                        @else
                            <a @unless($subscribed) href="{{ route('subscription.subscribe', ['level' => 'Timekeeper', 'interval' => 'yearly']) }}" @else href="javascript:" @endunless @if($subscribed) onclick="swal('info','This doesn\'t work yet', 'info')" @endif class="btn btn-primary subscribe yearly">{{ $subscribed ? 'Switch to' : 'Subscribe' }} Yearly</a>
                        @endif
                    @endguest
                </div>
            </div>
            <div class="col-12 col-lg-4 subscription-option">
                <div class="inner">
                    <h2>Worldbuilder</h2>
                    <h5>For power users who want to collaborate using the greatest multi-user fantasy calendar tool on the market.</h5>
                    <h3 class="bg-grey monthly">$2.99 / month</h3>
                    <h3 class="bg-grey yearly">$29.99 / year<br><p class="small">Two months free!</p class=small></h3>
                    <ul class="features">
                        <li><strong>Full</strong> calendar functionality</li>
                        <li><strong>Unlimited</strong> number of calendars</li>
                        <li>Icon next to your username</li>
                        <li>Worldbuilder Discord role</li>
                        <li>Subscriber-only Discord channel</li>
                        <li>Calendar <strong>co-ownership</strong> <p class="small">Co-owners can comment on events, create events, and change the current date.</p></li>
                        <li>Add <strong>users</strong> to your calendars <p class="small">Users can comment on events and view provided information</p> </li>
                    </ul>
                    @guest
                        <a href="{{ route('user.register') }}">Register to subscribe</a>
                    @else
                        @if(Auth::user()->subscribedToPlan('worldbuilder_monthly', 'Worldbuilder'))
                            <a href="#" class="btn btn-secondary disabled monthly">You have this!</a>
                        @else
                            <a @unless($subscribed) href="{{ route('subscription.subscribe', ['level' => 'Worldbuilder', 'interval' => 'monthly']) }}" @else href="javascript:" @endunless @if($subscribed) onclick="swal('info','This doesn\'t work yet', 'info')" @endif class="btn btn-primary subscribe monthly">{{ $subscribed ? 'Switch to' : 'Subscribe' }} Monthly</a>
                        @endif

                        @if(Auth::user()->subscribedToPlan('worldbuilder_yearly', 'Worldbuilder'))
                            <a href="#" class="btn btn-secondary disabled yearly">You have this!</a>
                        @else
                            <a @unless($subscribed) href="{{ route('subscription.subscribe', ['level' => 'Worldbuilder', 'interval' => 'yearly']) }}" @else href="javascript:" @endunless @if($subscribed) onclick="swal('info','This doesn\'t work yet', 'info')" @endif class="btn btn-primary subscribe yearly">{{ $subscribed ? 'Switch to' : 'Subscribe' }} Yearly</a>
                        @endif
                    @endguest
                </div>
            </div>
        </div>
    </div>
@endsection
