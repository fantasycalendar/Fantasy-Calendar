@extends('pages.profile')

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

            $('#card-holder-name').on('blur', function(){
                if($(this).val().length < 1) {
                    $(this).addClass('error');
                    $(this).addClass('protip');
                    $(this).attr('data-pt-title', 'This field is required.');
                } else {
                    $(this).removeClass('error');
                    $(this).removeAttr('data-pt-title');
                    $(cardButton).removeClass('disabled');
                    $(cardButton).toggleClass('btn-primary');
                    $(cardButton).toggleClass('btn-secondary');
                }
            });

            cardButton.addEventListener('click', async (e) => {
                if($("#card-holder-name").val().length < 1 || $(cardButton).hasClass('disabled')) {
                    return false;
                }

                $(cardButton).addClass('disabled');
                $('#card-button .spinner-border').removeClass('hidden');

                const { setupIntent, error } = await stripe.handleCardSetup(
                    clientSecret, cardElement, {
                        payment_method_data: {
                            billing_details: { name: cardHolderName.value }
                        }
                    }
                );

                if (error) {
                    console.log(error);
                    swal("Oops", "Something went wrong: " + error.message, "error");
                    $(cardButton).removeClass('disabled');
                    $('#card-button .spinner-border').addClass('hidden');
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
        #card-button {
            display: flex;
            align-items: center;
        }
        #card-button.disabled {
            cursor: initial;
        }
        #card-holder-name.error {
            border: 1px solid red;
        }
    </style>
@endpush

@section('profile-card-header')
    Subscribe to {{ $level }} on a {{ $interval }} basis.
@endsection

@section('profile-card')
    <p class="small">Don't worry, your card information never touches our servers! It's safely handled by Stripe.</p>

    <div class="paymentbox">
        <input class="form-control" id="card-holder-name" type="text" placeholder="Cardholder Name">

        <!-- Stripe Elements Placeholder -->
        <div id="card-element" class="my-2 py-2 form-control"></div>

        <button id="card-button" class="btn btn-secondary disabled" data-secret="{{ $intent->client_secret }}">
            <div class="spinner-border text-light mr-2 hidden" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            Get subscribed
        </button>
    </div>
@endsection
