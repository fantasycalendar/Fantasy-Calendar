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
                    axios.post('{{ route('subscription.update', ['level' => $level, 'plan' => $plan]) }}', {
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

    <style>
    </style>
@endpush

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-12 py-5">
                <div class="card">
                    <h5 class="card-header">Subscribe to {{ $level }} on a {{ $interval }} basis.</h5>
                    <div class="card-body">
                        <div class="card-text">
                            <p class="small">Don't worry, your card information never touches our servers! It's safely handled by Stripe.</p>

                            <div class="paymentbox">
                                <input class="form-control" id="card-holder-name" type="text" placeholder="Cardholder Name">

                                <!-- Stripe Elements Placeholder -->
                                <div id="card-element" class="my-2 py-2"></div>

                                <button id="card-button" class="btn btn-primary" data-secret="{{ $intent->client_secret }}">
                                    Get subscribed
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
