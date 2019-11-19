@extends('templates._page')

@push('head')
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
                    axios.post('{{ route('subscription.update', ['level' => $level]) }}', {
                        token: setupIntent.payment_method
                    })
                    .then(function (response) {
                        location.reload();
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
                }
            });
        });
    </script>
@endpush

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h1>Subscribe to {{ $level }} on a {{ $plan }} basis.</h1>
                <h3>Don't worry, your card information never touches our servers! It's safely handled by Stripe.</h3>

                <div class="paymentbox">
                    <input class="form-control" id="card-holder-name" type="text">

                    <!-- Stripe Elements Placeholder -->
                    <div id="card-element" class="my-4"></div>

                    <button id="card-button" data-secret="{{ $intent->client_secret }}">
                        Get subscribed
                    </button>
                </div>
            </div>
        </div>
    </div>
@endsection
