@extends('templates._page')

@push('head')
    @if(Auth::check() && !Auth::user()->subscribed('Timekeeper') && !Auth::user()->subscribed('Worldbuilder'))
        <script>
            $(document).ready(function(){
                const stripe = Stripe('{{ env('STRIPE_KEY') }}');

                const elements = stripe.elements();
                const cardElement = elements.create('card');

                cardElement.mount('#card-element');

                const cardHolderName = document.getElementById('card-holder-name');
                const cardButton = document.getElementById('card-button');
                const clientSecret = cardButton.dataset.secret;

                cardButton.addEventListener('click', async (e) => {
                    const { setupIntent, error } = await stripe.handleCardSetup(
                        clientSecret, cardElement, {
                            payment_method_data: {
                                billing_details: { name: cardHolderName.value }
                            }
                        }
                    );

                    if (error) {
                        swal("Oops", "Something went wrong: " + error, "error");
                    } else {
                        axios.post('{{ route('subscription.update') }}', {
                            token: setupIntent.payment_method
                        })
                        .then(function (response) {
                            console.log(setupIntent);
                            console.log(response);
                        })
                        .catch(function(error) {
                            console.log(error);
                        });
                    }
                });
            });
        </script>
    @endif

    <script>
        $(document).ready(function(){
            $('.subscribe').click(function() {
                swal("Wow!", "Thanks for your interest. Fantasy Calendar isn't currently able to accept money.", "info");
            });
        });
    </script>

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
            font-size: 0.9rem;
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
    </style>
@endpush

@section('content')
    <div class="container">
        <h1 class="center-text">Subscribe to Fantasy Calendar</h1>

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
                        <a href="javascript:" class="btn btn-secondary btn-secondary disabled">You have this!</a>
                    @endguest
                </div>
            </div>
            <div class="col-12 col-lg-4 subscription-option">
                <div class="inner">
                    <h2>Timekeeper</h2>
                    <h5>For users who need to keep track of multiple timelines, universes, or games.</h5>
                    <h3 class="bg-grey">$1.49 / month</h3>
                    <ul class="features">
                        <li><strong>Full</strong> calendar functionality</li>
                        <li><strong>Unlimited</strong> number of calendars</li>
                        <li>Icon next to your username</li>
                        <li>Timekeeper Discord role</li>
                        <li>Subscriber-only Discord channel</li>
                    </ul>
                    @if(Auth::check() && Auth::user()->subscribed('Timekeeper'))
                        <a href="javascript:" class="btn btn-secondary disabled">You have this!</a>
                    @else
                        <a href="javascript:" class="btn btn-primary subscribe">Subscribe Now</a>
                    @endif
                </div>
            </div>
            <div class="col-12 col-lg-4 subscription-option">
                <div class="inner">
                    <h2>Worldbuilder</h2>
                    <h5>For power users who want to collaborate using the greatest multi-user fantasy calendar tool on the market.</h5>
                    <h3 class="bg-grey">$2.99 / month</h3>
                    <ul class="features">
                        <li><strong>Full</strong> calendar functionality</li>
                        <li><strong>Unlimited</strong> number of calendars</li>
                        <li>Icon next to your username</li>
                        <li>Timekeeper Discord role</li>
                        <li>Subscriber-only Discord channel</li>
                        <li>Calendar <strong>co-ownership</strong> <p class="small">Co-owners can comment on events, create events, and change the current date.</p></li>
                        <li>Add <strong>users</strong> to your calendars <p class="small">Users can comment on events and view provided information</p> </li>
                    </ul>
                    @if(Auth::check() && Auth::user()->subscribed('Worldbuilder'))
                        <a href="javascript:" class="btn btn-secondary disabled">You have this!</a>
                    @else
                        <a href="javascript:" class="btn btn-primary subscribe">Subscribe Now</a>
                    @endif
                </div>
            </div>
        </div>
    </div>
@endsection
