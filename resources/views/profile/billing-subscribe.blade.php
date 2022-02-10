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
                    <div class="border-t border-gray-100 dark:border-gray-700 w-full sm:hidden mt-8 w-full"></div>
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
                                x-bind:disabled="!ready"
                                @click="ready && cardButtonSubmit()"
                                class="w-full justify-center hover:cursor-pointer disabled:cursor-default"
                            >
                                <svg x-show="submitting" role="status" class="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                </svg>

                                <span x-show="!submitting" class="text-md">
                                    Confirm {{ $interval }} subscription
                                </span>

                                <span x-show="submitting" class="text-md">
                                    Contacting Stripe...
                                </span>
                            </x-button>
                        </div>
                    </x-slot>
                </x-panel>
            </div>
        </div>
    </main>
</x-app-layout>
