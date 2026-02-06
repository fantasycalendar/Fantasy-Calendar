@push('head')
    <script>
        function subscription() {
            return {
                ready: false,
                readies: {
                    Number: false,
                    Cvc: false,
                    Expiry: false,
                    Name: false,
                    all: function() {
                        return this.Number
                            && this.Name
                            && this.Expiry
                            && this.Cvc;
                    }
                },
                complete: false,
                submitting: false,
                attempted: false,
                cardholder: "",
                cardtried: false,
                cardNumberElement: false,
                cardExpiryElement: false,
                cardCvcElement: false,
                errors: {
                    messages: {
                        cardNumberError: "",
                        cardCvcError: "",
                        cardExpiryError: "",
                        cardholderError: "",
                    },
                    any: function() {
                        return this.messages.cardNumberError.length
                             + this.messages.cardCvcError.length
                             + this.messages.cardExpiryError.length
                             + this.messages.cardholderError.length !== 0;
                    }
                },
                elements: null,
                init: function() {
                    console.table(Object.entries(this.errors.messages));

                    this.stripe = Stripe('{{ env('STRIPE_KEY') }}');
                    this.elements = this.stripe.elements();
                    const style = {
                        base: {
                            fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                            fontSize: '16px',
                            color: '#C1C7CD'
                        },
                        invalid: {
                            color: 'red',
                        },
                    };
                    const classes = {
                        invalid: 'border-red-500 dark:border-red-600',
                    };

                    this.cardNumberElement = this.elements.create('cardNumber', {
                        style,
                        classes
                    });
                    this.clientSecret = "{{ $intent->client_secret }}";

                    this.cardNumberElement.mount('#cardNumber-element');
                    this.cardNumberElement.on('change', (event) => {
                        if (event.complete) {
                            this.errors.messages.cardNumberError = "";
                            this.readies.Number = true;
                        } else if (event.error) {
                            this.errors.messages.cardNumberError = event.error.message;
                            this.readies.Number = false;
                        }

                        this.evaluateErrors();
                    });

                    this.cardExpiryElement = this.elements.create('cardExpiry', {
                        style,
                        classes
                    });
                    this.clientSecret = "{{ $intent->client_secret }}";

                    this.cardExpiryElement.mount('#cardExpiry-element');
                    this.cardExpiryElement.on('change', (event) => {
                        if (event.complete) {
                            this.errors.messages.cardExpiryError = "";
                            this.readies.Expiry = true;
                        } else if (event.error) {
                            this.errors.messages.cardExpiryError = event.error.message;
                            this.readies.Expiry = false;
                        }

                        this.evaluateErrors();
                    });

                    this.cardCvcElement = this.elements.create('cardCvc', {
                        style,
                        classes
                    });
                    this.clientSecret = "{{ $intent->client_secret }}";

                    this.cardCvcElement.mount('#cardCvc-element');
                    this.cardCvcElement.on('change', (event) => {
                        if (event.complete) {
                            this.errors.messages.cardCvcError = "";
                            this.readies.Cvc = true;
                        } else if (event.error) {
                            this.errors.messages.cardCvcError = event.error.message;
                            this.readies.Cvc = false;
                        }

                        this.evaluateErrors();
                    });
                },
                evaluateErrors: function() {
                    if(!this.cardholder.length) {
                        this.errors.messages.cardholderError = "Cardholder Name is required.";
                        this.readies.Name = false;
                    } else {
                        this.errors.messages.cardholderError = "";
                        this.readies.Name = true;
                    }

                    console.table(Object.entries(this.errors.messages));

                    this.ready = !this.errors.any() && this.readies.all();
                },
                cardButtonSubmit: async function() {
                    this.ready = false;
                    this.submitting = true;

                    const { setupIntent, error } = await this.stripe.handleCardSetup(
                        this.clientSecret, this.cardNumberElement, {
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
@endpush

<x-app-layout>
    <main class="max-w-7xl mx-auto pb-10" x-data="subscription()">
        <div class="md:grid md:grid-cols-12 md:gap-x-5">
            <aside class="pb-6 px-0 sm:px-6 lg:pb-0 md:px-0 md:col-span-6">
                <div>
                    <h2 id="user-details-heading" class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">Payment Details</h2>
                </div>

                <p class="text-sm text-gray-500 dark:text-gray-400">We partner with Stripe for billing, your payment info never touches our servers.</p>

                <div class="mt-6 grid grid-cols-2 gap-4">

                    <div class="col-span-2">
                        <x-text-input
                            x-bind:class="{ 'dark:border-red-600 focus:ring-red-500 focus:border-red-500 border-red-300': errors.messages.cardholderError }"
                            id="card-holder-name"
                            type="text"
                            label="Cardholder Name"
                            :placeholder="random_fantasy_name()"
                            x-model="cardholder"
                            @blur="evaluateErrors"
                            @keyup="evaluateErrors"
                        ></x-text-input>
                    </div>

{{--                    <x-alert type="danger"--}}
{{--                             class="col-span-2"--}}
{{--                             id="cardholder-error"--}}
{{--                             x-show="errors.cardholderError"--}}
{{--                    >--}}
{{--                        Cardholder Name is required.--}}
{{--                    </x-alert>--}}

                    <div class="col-span-2">
                        <label for="cardNumber-element" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Card Number</label>
                        <!-- Stripe Elements Placeholder -->
                        <div id="cardNumber-element" class="border disabled:text-gray-500 disabled:bg-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 text-gray-600 focus:ring-primary-500 focus:border-primary-500 block w-full py-2.5 px-2 shadow-sm border-gray-300 rounded-md"></div>
                    </div>

                    <div class="col-span-1">
                        <label for="cardCvc-element" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Card CVC</label>
                        <div id="cardCvc-element" class="border disabled:text-gray-500 disabled:bg-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 mt-1 text-gray-600 focus:ring-primary-500 focus:border-primary-500 block w-full py-2.5 px-2 shadow-sm border-gray-300 rounded-md"></div>
                    </div>

                    <div class="col-span-1">
                        <label for="cardExpiry-element" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Card Expiry</label>
                        <div id="cardExpiry-element" class="border disabled:text-gray-500 disabled:bg-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 mt-1 text-gray-600 focus:ring-primary-500 focus:border-primary-500 block w-full py-2.5 px-2 shadow-sm border-gray-300 rounded-md"></div>
                    </div>

                    <x-alert class="col-span-2" type="danger" id="card-errors" x-show="errors.any()" x-cloak>
                        <ul class="text-current list-disc ml-4">
                            <template x-for="message in Object.values(errors.messages).filter((message) => message.length)">
                                <li class="text-current" x-text="message"></li>
                            </template>
                        </ul>
                    </x-alert>
                </div>

                <div class="px-10">
                    <div class="border-t border-gray-100 dark:border-gray-700 w-full sm:hidden mt-8"></div>
                </div>
            </aside>

            <div class="space-y-6 sm:px-6 md:px-0 md:col-span-6">
                <h1 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">Order Summary</h1>
                <x-panel>

                    <h2 class="text-md font-semibold text-gray-800 dark:text-gray-300">Fantasy Calendar Timekeeper subscription</h2>

                    <div class='grid grid-cols-2 gap-1'>
                        <div class="col-span-2 sm:col-span-1 text-sm sm:text-base -mb-1 sm:mb-0 mt-2 sm:mt-0 text-gray-700 dark:text-gray-400">
                            Payment interval
                        </div>
                        <div class="col-span-2 sm:col-span-1 text-black dark:text-white">
                            {{ ucwords($interval) }}
                        </div>
                        <div class="col-span-2 sm:col-span-1 text-sm sm:text-base -mb-1 sm:mb-0 mt-2 sm:mt-0 text-gray-700 dark:text-gray-400">
                            Price
                        </div>
                        <div class="col-span-2 sm:col-span-1 text-black dark:text-white">
                            {{ auth()->user()->subscriptionPrice($interval) }}
                            <span class="text-sm text-gray-600 dark:text-gray-400">(includes VAT)</span>
                        </div>
                        <div class="col-span-2 sm:col-span-1 text-sm sm:text-base -mb-1 sm:mb-0 mt-2 sm:mt-0 text-gray-700 dark:text-gray-400">
                            Automatically renews on
                        </div>
                        <div class="col-span-2 sm:col-span-1 text-black dark:text-white">
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
                                @click="ready && cardButtonSubmit()"
                                class="w-full justify-center hover:cursor-pointer disabled:cursor-default"
                                ::disabled="!ready"
                                loading-model="submitting"
                                loading-label="Contacting Stripe..."
                            >
                                Confirm {{ $interval }} subscription
                            </x-button>
                        </div>
                    </x-slot>
                </x-panel>
            </div>
        </div>
    </main>
</x-app-layout>
