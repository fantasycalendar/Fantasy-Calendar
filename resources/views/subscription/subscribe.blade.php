@extends('pages.profile')

@push('head')
    <script>
        function subscription() {
            return {
                ready: false,
                complete: false,
                submitting: false,
                attempted: false,
                cardholder: "",
                cardtried: false,
                errors: {
                    stripeError: "",
                    cardholderError: "",
                    any: function() {
                        console.log(this.stripeError.length);
                        console.log(this.cardholderError.length);
                        return this.stripeError.length !== 0 || this.cardholderError.length !== 0;
                    }
                },
                elements: null,
                init: function() {
                    this.stripe = Stripe('{{ env('STRIPE_KEY') }}');
                    this.elements = this.stripe.elements();

                    this.cardElement = this.elements.create('card', {
                        'style': {
                            'base': {
                                'fontFamily': 'Arial, sans-serif',
                                'fontSize': '18px',
                                'color': '#C1C7CD',
                            },
                            'invalid': {
                                'color': 'red',
                            },
                        }
                    });
                    this.clientSecret = "{{ $intent->client_secret }}";

                    this.cardElement.mount('#card-element');
                    this.cardElement.on('change', (event) => {
                        this.cardtried = true;

                        if (event.complete) {
                            this.errors.stripeError = "";
                            this.evaluateErrors();
                        } else if (event.error) {
                            this.errors.stripeError = event.error.message;
                            this.evaluateErrors();
                        }
                    });
                },
                evaluateErrors: function() {
                    if(!this.cardholder.length) {
                        this.errors.cardholderError = "Cardholder Name is required.";
                    } else {
                        this.errors.cardholderError = "";
                    }

                    this.ready = !this.errors.any() && this.cardtried;
                },
                cardButtonSubmit: async function() {
                    this.ready = false;
                    this.submitting = true;

                    const { setupIntent, error } = await this.stripe.handleCardSetup(
                        this.clientSecret, this.cardElement, {
                            payment_method_data: {
                                billing_details: { name: this.cardholder }
                            }
                        }
                    );

                    if (error) {
                        console.log(error);
                        swal.fire("Oops", "Something went wrong: " + error.message, "error");
                        this.errors.stripeError = error.message;
                        this.ready = false;
                        this.submitting = false;
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
                }
            }
        }
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
    Subscribe to Fantasy-Calendar on a {{ $interval }} basis.
@endsection

@section('profile-card')

    <h4>Plan information</h4>

    <div class='container my-2'>
        <div class="row">
            <div class="col-3 p-0">
                Payment interval:
            </div>
            <div class="col p-0">
                {{ ucwords($interval) }}
            </div>
        </div>
        <div class="row">
            <div class="col-3 p-0">
                Price:
            </div>
            <div class="col p-0">
                @if($user->isEarlySupporter())
                    @if($interval == "monthly")
                        $1.99
                    @else
                        $19.99
                    @endif
                @else
                    @if($interval == "monthly")
                        $2.49
                    @else
                        $24.99
                    @endif
                @endif
            </div>
        </div>
        <div class="row">
            <div class="col-3 p-0">
                Renews on:
            </div>
            <div class="col p-0">
                {{ $renew_at }}
            </div>
        </div>
    </div>

    <p><a href="{{ route('subscription.pricing') }}" class='btn btn-secondary'><i class="fas fa-arrow-left"></i> Change plan</a></p>

    <p>You can cancel your subscription at any point from your <a href="{{ route('profile') }}">profile</a>.</p>

    <hr>

    <p class="small">Don't worry, your card information never touches our servers! It's safely handled by Stripe.</p>

    <div class="paymentbox" x-data="subscription()" x-init="init()">
        <input class="form-control mb-1" :class="{ error: errors.cardholderError.length > 0 }" id="card-holder-name" type="text" placeholder="Cardholder Name" x-model="cardholder" @blur="evaluateErrors">

        <div id="cardholder-error" class="alert alert-danger hidden" :class="{ hidden: !errors.cardholderError.length }" x-text="errors.cardholderError"></div>

        <!-- Stripe Elements Placeholder -->
        <div id="card-element" class="my-2 py-2 form-control" @change="onCardElementChange"></div>

        <div id="card-errors" class="alert alert-danger hidden" :class="{ hidden: !errors.stripeError.length }" x-text="errors.stripeError"></div>

        <button
            id="card-button"
            class="btn btn-secondary"
            :class="{
                'btn-secondary': !ready,
                'btn-primary': ready
            }"
            :disabled="!ready"
            @click="ready && cardButtonSubmit()"
        >
            <div class="spinner-border text-light mr-2 hidden" :class="{ hidden: !submitting }" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            Pay now
        </button>
    </div>
@endsection
