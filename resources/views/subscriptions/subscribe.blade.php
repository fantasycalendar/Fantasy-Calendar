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
@endpush

@section('content')
    <div class="container">
        @auth
            @if(Auth::user()->subscribed('Timekeeper') || Auth::user()->subscribed('Worldbuilder'))
                You're subscribed to the {{ (Auth::user()->subscribed('Timekeeper')) ? 'Timekeeper' : 'Worldbuilder' }} plan!
            @else
                <input class="form-control my-4" id="card-holder-name" type="text">

                <!-- Stripe Elements Placeholder -->
                <div id="card-element"></div>

                <button id="card-button" data-secret="{{ $intent->client_secret }}">
                    Submit payment method
                </button>
            @endif
        @else
            OOOPS! Yer not logged in.

            <a class="btn btn-primary" href="{{ route('auth.login') }}">Login to subscribe</a>
        @endauth
    </div>
@endsection
