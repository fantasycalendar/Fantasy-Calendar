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
                        return this.stripeError.length + this.cardholderError.length > 0;
                    }
                },
                elements: null,
                init: function() {
                    this.stripe = Stripe('{{ env('STRIPE_KEY') }}');
                    const appearance = {
                        theme: 'stripe',
                        variables: {
                            fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                            colorText: '{{ auth()->user()->setting('dark_theme') ? '#d1d5db' : '#6b7280' }}',
                            colorBackground: '{{ auth()->user()->setting('dark_theme') ? '#374151' : 'white' }}',
                            colorTextPlaceholder: '#6b7280',
                            colorPrimary: '#2f855a'
                        }
                    };
                    this.elements = this.stripe.elements({
                        clientSecret: "{{ $intent->client_secret }}",
                        appearance
                    });

                    this.cardElement = this.elements.create('payment');
                    this.clientSecret = "{{ $intent->client_secret }}";

                    this.cardElement.mount('#card-element');
                    this.cardElement.on('change', function(event) {
                        if (event.complete) {
                            this.cardtried = true;
                            this.errors.stripeError = "";
                            this.evaluateErrors();
                        } else if (event.error) {
                            console.log(event.error);
                            this.errors.stripeError = event.error.message;
                            this.evaluateErrors();
                        }
                    }.bind(this));
                },
                evaluateErrors: function() {
                    console.log(this.errors.any(), this.cardtried);
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

                    const { error } = await this.stripe.confirmPayment({
                        elements: this.elements,
                        confirmParams: {
                            return_url: '{{ route('profile.billing') }}'
                        }
                    });

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
@endpush

<x-app-layout>
    <main class="max-w-7xl mx-auto pb-10" x-data="subscription()" x-init="init()">
        <div class="md:grid md:grid-cols-12 md:gap-x-5">
            <aside class="pb-6 px-2 sm:px-6 lg:pb-0 md:px-0 md:col-span-6">
                <div>
                    <h2 id="user-details-heading" class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">Payment Details</h2>
                </div>

                <p class="text-sm text-gray-500 dark:text-gray-400">We partner with Stripe for billing, your payment info never touches our servers.</p>

                <div class="space-y-4 mt-6">

                    <div>
                        <x-text-input x-bind:class="{ error: errors.cardholderError.length > 0 }" id="card-holder-name" type="text" label="Cardholder Name" :placeholder="random_fantasy_name()" x-model="cardholder" @blur="evaluateErrors"></x-text-input>
                    </div>

                    <x-alert type="danger" id="cardholder-error" x-bind:class="{ hidden: !errors.cardholderError.length }" x-text="errors.cardholderError"></x-alert>

                    <!-- Stripe Elements Placeholder -->
                    <div id="card-element" class="" @change="onCardElementChange"></div>

                    <x-alert type="danger" id="card-errors" x-bind:class="{ hidden: !errors.stripeError.length }" x-text="errors.stripeError"></x-alert>
                </div>
            </aside>

            <div class="space-y-6 sm:px-6 md:px-0 md:col-span-6">
                <h1 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">Order Summary</h1>
                <x-panel>

                    <h2 class="text-md font-semibold text-gray-800 dark:text-gray-300">Fantasy Calendar Timekeeper subscription</h2>

                    <div class='grid grid-cols-2 gap-1'>
                        <div class="col-span-1 text-gray-700 dark:text-gray-400">
                            Payment interval
                        </div>
                        <div class="col-span-1 text-black dark:text-white">
                            {{ ucwords($interval) }}
                        </div>
                        <div class="col-span-1 text-gray-700 dark:text-gray-400">
                            Price
                        </div>
                        <div class="col-span-1 text-black dark:text-white">
                            {{ auth()->user()->subscriptionPrice($interval) }}
                            <span class="text-sm text-gray-600 dark:text-gray-400">(includes VAT)</span>
                        </div>
                        <div class="col-span-1 text-gray-700 dark:text-gray-400">
                            Automatically renews on
                        </div>
                        <div class="col-span-1 text-black dark:text-white">
                            {{ $renew_at }}
                        </div>
                    </div>

                    <div class="w-full border-t border-gray-300 dark:border-gray-700"></div>

                    <div class="text-sm">
                        By pressing <strong>Confirm {{ $interval }} subscription</strong>, you verify that you are at least 13 years old and agree to the <a href="{{ route('terms-and-conditions') }}">Terms and Conditions</a> which include details of your right to withdrawal within 14 days.
                    </div>

                    <x-slot name="footer">
                        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-700 sm:px-6">
                            <x-button
                                id="card-button"
                                x-bind:disabled="!ready"
                                @click="ready && cardButtonSubmit()"
                                class="w-full justify-center hover:cursor-pointer disabled:cursor-default"
                            >
                                <div class="spinner-border text-light mr-2 hidden" :class="{ hidden: !submitting }" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                                Confirm {{ $interval }} subscription
                            </x-button>
                        </div>
                    </x-slot>
                </x-panel>
            </div>
        </div>
    </main>
</x-app-layout>
