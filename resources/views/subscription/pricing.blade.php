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

    <script>

        function validate_coupon(coupon_code){

            return new Promise((resolve, reject) => {

                $.ajax({
                    url:"pricing/coupon",
                    type: "post",
                    dataType: 'json',
                    data: { coupon_code: coupon_code },
                    success: function( result ){
                        resolve(result);
                    },
                    error: function ( log )
                    {
                        swal({
                            icon: "error",
                            title: "Error!",
                            text: "Something went wrong!",
                            button: true
                        })
                        console.log(log)
                    }
                });
                    
            })
        }

        $(document).ready(function(){

            const coupon_button = $('#coupon_button');
            const coupon_input = $('#coupon_input');

            coupon_input.on('keydown', function(event){
                if(event.keyCode == 13){
                    coupon_button.click();
                }
            });

            coupon_button.on('click', async function(){

                $('#coupon_message').text('Checking coupon...').toggleClass('hidden', false);

                var coupon_text = coupon_input.val();

                var result = await validate_coupon(coupon_text);

                $('#coupon_message').text(result.message);

                coupon_input.toggleClass('border-success', result.success).toggleClass('border-danger', !result.success);

                if(result.success){
                    apply_coupon(result);
                }

            });

        });

        function apply_coupon(coupon){

            if(coupon.percent_off){

                $('#timekeeper_monthly').text(precisionRound(1.99*(1-(coupon.percent_off*0.01)), 2));
                $('#timekeeper_yearly').text(precisionRound(19.99*(1-(coupon.percent_off*0.01)), 2));
                $('#timekeeper_monthly_text').text(`${coupon.percent_off}% off!`)
                $('#timekeeper_yearly_text').text(`${coupon.percent_off}% off!`)

                $('#worldbuilder_monthly').text(precisionRound(2.99*(1-(coupon.percent_off*0.01)), 2));
                $('#worldbuilder_yearly').text(precisionRound(29.99*(1-(coupon.percent_off*0.01)), 2));
                $('#worldbuilder_monthly_text').text(`${coupon.percent_off}% off!`)
                $('#worldbuilder_yearly_text').text(`${coupon.percent_off}% off!`)

            }else{

                var timekeeper_monthly = precisionRound(1.99-coupon.amount_off/100, 2)
                var timekeeper_yearly = precisionRound(19.99-coupon.amount_off/100, 2)
                var timekeeper_monthly_perc = Math.round((1-timekeeper_monthly/1.99)*100)
                var timekeeper_yearly_perc = Math.round((1-timekeeper_yearly/19.99)*100)

                $('#timekeeper_monthly').text(timekeeper_monthly);
                $('#timekeeper_yearly').text(timekeeper_yearly);
                $('#timekeeper_monthly_text').text(`$${precisionRound(coupon.amount_off/100, 2)} off (for a total of ${timekeeper_monthly_perc}% off)!`)
                $('#timekeeper_yearly_text').text(`$${precisionRound(coupon.amount_off/100, 2)} off (for a total of ${timekeeper_yearly_perc}% off)!`)

                var worldbuilder_monthly = precisionRound(2.99-coupon.amount_off/100, 2)
                var worldbuilder_yearly = precisionRound(29.99-coupon.amount_off/100, 2)
                var worldbuilder_monthly_perc = Math.round((1-worldbuilder_monthly/2.99)*100)
                var worldbuilder_yearly_perc = Math.round((1-worldbuilder_yearly/29.99)*100)

                $('#worldbuilder_monthly').text(worldbuilder_monthly);
                $('#worldbuilder_yearly').text(worldbuilder_yearly);
                $('#worldbuilder_monthly_text').text(`$${precisionRound(coupon.amount_off/100, 2)} off (for a total of ${worldbuilder_monthly_perc}% off)!`)
                $('#worldbuilder_yearly_text').text(`$${precisionRound(coupon.amount_off/100, 2)} off (for a total of ${worldbuilder_yearly_perc}% off)!`)

            }

        }

    </script>

    <div class="container pt-4">
        <h1 class="center-text">Subscribe to Fantasy Calendar</h1>

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
                        @unless($subscribed && !Auth::user()->subscriptions->first()->onGracePeriod())
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
                    <h3 class="bg-grey monthly">$<span id='timekeeper_monthly'>1.99</span> / month<br><p class="small" id='timekeeper_monthly_text'></p class=small></h3>
                    <h3 class="bg-grey yearly">$<span id='timekeeper_yearly'>19.99</span> / year<br><p class="small" id='timekeeper_yearly_text'>Two months free (16% discount)!</p class=small></h3>
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
                            @if(Auth::user()->subscriptions->first()->onGracePeriod())
                                <a href="{{ route('subscription.resume', ['level' => 'Timekeeper']) }}" class="btn btn-info monthly">Resume monthly</a>
                            @else
                                <a href="#" class="btn btn-secondary disabled monthly">You have this!</a>
                            @endif
                        @else
                            <a @unless($subscribed) href="{{ route('subscription.subscribe', ['level' => 'Timekeeper', 'interval' => 'monthly']) }}" @else href="javascript:" @endunless @if($subscribed) onclick="swal('info','This doesn\'t work yet, you\'ll need to cancel and re-subscribe to change plans.', 'info')" @endif class="btn btn-primary subscribe monthly">{{ $subscribed ? 'Switch to' : 'Subscribe' }} Monthly</a>
                        @endif

                        @if(Auth::user()->subscribedToPlan('timekeeper_yearly', 'Timekeeper'))
                                @if(Auth::user()->subscriptions->first()->onGracePeriod())
                                    <a href="{{ route('subscription.resume', ['level' => 'Timekeeper']) }}" class="btn btn-info yearly">Resume yearly</a>
                                @else
                                    <a href="#" class="btn btn-secondary disabled monthly">You have this!</a>
                                @endif
                        @else
                            <a @unless($subscribed) href="{{ route('subscription.subscribe', ['level' => 'Timekeeper', 'interval' => 'yearly']) }}" @else href="javascript:" @endunless @if($subscribed) onclick="swal('info','This doesn\'t work yet, you\'ll need to cancel and re-subscribe to change plans.', 'info')" @endif class="btn btn-primary subscribe yearly">{{ $subscribed ? 'Switch to' : 'Subscribe' }} Yearly</a>
                        @endif
                    @endguest
                </div>
            </div>
            <div class="col-12 col-lg-4 subscription-option">
                <div class="inner">
                    <h2>Worldbuilder</h2>
                    <h5>For power users who want to collaborate using the greatest multi-user fantasy calendar tool on the market.</h5>
                    <h3 class="bg-grey monthly">$<span id='worldbuilder_monthly'>2.99</span> / month<br><p class="small" id='worldbuilder_monthly_text'></p class=small></h3>
                    <h3 class="bg-grey yearly">$<span id='worldbuilder_yearly'>29.99</span> / year<br><p class="small" id='worldbuilder_yearly_text'>Two months free (16% discount)!</p class=small></h3>
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
                            @if(Auth::user()->subscriptions->first()->onGracePeriod())
                                <a href="{{ route('subscription.resume', ['level' => 'Worldbuilder']) }}" class="btn btn-info monthly">Resume monthly</a>
                            @else
                                <a href="#" class="btn btn-secondary disabled monthly">You have this!</a>
                            @endif
                        @else
                            <a @unless($subscribed) href="{{ route('subscription.subscribe', ['level' => 'Worldbuilder', 'interval' => 'monthly']) }}" @else href="javascript:" @endunless @if($subscribed) onclick="swal('info','This doesn\'t work yet, you\'ll need to cancel and re-subscribe to change plans.', 'info')" @endif class="btn btn-primary subscribe monthly">{{ $subscribed ? 'Switch to' : 'Subscribe' }} Monthly</a>
                        @endif

                        @if(Auth::user()->subscribedToPlan('worldbuilder_yearly', 'Worldbuilder'))
                                @if(Auth::user()->subscriptions->first()->onGracePeriod())
                                    <a href="{{ route('subscription.resume', ['level' => 'Worldbuilder']) }}" class="btn btn-info yearly">Resume yearly</a>
                                @else
                                    <a href="#" class="btn btn-secondary disabled monthly">You have this!</a>
                                @endif
                        @else
                            <a @unless($subscribed) href="{{ route('subscription.subscribe', ['level' => 'Worldbuilder', 'interval' => 'yearly']) }}" @else href="javascript:" @endunless @if($subscribed) onclick="swal('info','This doesn\'t work yet, you\'ll need to cancel and re-subscribe to change plans.', 'info')" @endif class="btn btn-primary subscribe yearly">{{ $subscribed ? 'Switch to' : 'Subscribe' }} Yearly</a>
                        @endif
                    @endguest
                </div>
            </div>

        </div>
    </div>

    <div class="container align-items-center d-flex flex-column pt-4 pb-6 w-100">
        <div class="row">
            <div class="col-6 p-0 pr-1">
                <input type="text" placeholder="Coupon Code" class='form-control' id="coupon_input">
                
            </div>
            <div class="col-6 p-0 pl-1">
                <button type="button" class='btn btn-secondary w-100' id='coupon_button'>Apply coupon</button>
            </div>
        </div>
        <div class="row">
            <div class="col-12 p-2">
                <span id='coupon_message' class='hidden'></span>
            </div>
        </div>
    </div>
@endsection
