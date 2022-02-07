<x-profile-layout>
    <x-panel>
        <div>
            <h2 id="user-details-heading" class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">Subscription</h2>
        </div>

        <div>
            All of our billing is handled through Stripe, and they provide a billing portal where you can manage your subscription to Fantasy Calendar.
        </div>

        @if($promoCode)
            <x-alert type="notice">For being an early-supporter for Fantasy Calendar, you get a discount! Just apply this code while checking out on our billing portal below: <strong>{{ $promoCode }}</strong></x-alert>
        @endif

        <x-slot name="footer">
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 text-right sm:px-6">
                <x-button-link href="{{ route('profile.billing-portal') }}">Visit the billing portal now</x-button-link>
            </div>
        </x-slot>
    </x-panel>

        <section aria-labelledby="billing-history-heading">
            <div class="bg-white dark:bg-gray-800 pt-6 shadow sm:rounded-md sm:overflow-hidden">
                <div class="px-4 sm:px-6">
                    <h2 id="billing-history-heading" class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">Billing history</h2>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Here's a quick glance at your last few payments, but for more info you'll need to <a class="text-primary-600 hover:text-primary-900" href="{{ route('profile.billing-portal') }}">visit the Stripe billing portal</a>.</p>
                </div>
                <div class="mt-6 flex flex-col">
                    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div class="overflow-hidden border-t border-gray-200 dark:border-gray-700">
                                @if(auth()->user()->invoices()->count())
                                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead class="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Date</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Description</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Amount</th>
                                        <!--
                                          `relative` is added here due to a weird bug in Safari that causes `sr-only` headings to introduce overflow on the body on mobile.
                                        -->
                                        <th scope="col" class="relative px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                                            <span class="sr-only">View receipt</span>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    @foreach(auth()->user()->invoices()->take(6) as $invoice)
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                                                <time datetime="{{ $invoice->date()->format('Y-m-d') }}">{{ $invoice->date()->toFormattedDateString() }}</time>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">{{ $invoice->lines->first()->description }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-200">USD {{ format_money($invoice->amount_due) }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a target="_blank" href="{{ $invoice->hosted_invoice_url }}" class="text-primary-600 hover:text-primary-900">View receipt</a>
                                            </td>
                                        </tr>
                                    @endforeach
                                    </tbody>
                                </table>
                                @else
                                <!-- This example requires Tailwind CSS v2.0+ -->
                                    <div class="text-center m-8">
                                        <i class="fa fa-file-invoice text-gray-300 text-3xl"></i>
                                        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-300">No payment history</h3>
                                        <p class="mt-1 text-sm text-gray-500">You've never subscribed! Maybe it's time to change that?</p>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
</x-profile-layout>
