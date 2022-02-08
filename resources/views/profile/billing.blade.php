<x-profile-layout>
    <x-panel>
        <div>
            <h2 id="user-details-heading" class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">Subscription</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                @if($subscription)
                    <i class="pr-1 fa fa-credit-card"></i> {{ strtoupper(auth()->user()->card_brand) }} (...{{ auth()->user()->card_last_four }})
                    @unless($subscription->onGracePeriod())
                        <i class="fa fa-ellipsis-h px-2"></i><i class="pr-1 fa fa-calendar"></i> Renews on: {{ $subscription_renews_at }}
                    @else
                        <p class="text-red-500 dark:text-red-600"><i class="fa fa-exclamation-triangle"></i> Cancelled, ending {{ $subscription->ends_at->format('Y-m-d') }}</p>
                    @endunless
                @else
                    All of our billing is handled through Stripe, and your payment info never touches our servers.
                @endif
            </p>
        </div>

        @empty($subscription)
            @unless(auth()->user()->betaAccess())
                <x-alert type="notice">
                    <span class="text-lg font-medium">You're not subscribed</span><br>
                    Thanks for using Fantasy Calendar! We hope you like it enough to help keep the lights on.
                </x-alert>
            @else
                <x-alert type="success">
                    <span class="text-lg font-medium">You're a beta tester!</span><br>
                    As a big thank you for helping us beta test Fantasy Calendar, premium features will always be free for you. However, you can always subscribe anyway if you want to help us keep the lights on, too.
                </x-alert>
            @endunless

            <div>
                Fantasy Calendar is a labor of love, and we work on it in our spare time. If even half of our users subscribed for ${{ auth()->user()->isEarlySupporter() ? '1.49' : '2.49' }}/month, we'd be able to focus a lot more time on making it better (and more worth the money).
            </div>
        @else
            @unless($subscription->onGracePeriod())
                <x-alert type="success">
                    <span class="text-lg font-medium">You're subscribed!</span><br>
                    You're a subscriber to Fantasy Calendar, and that makes us happy. Thanks for your support.
                </x-alert>
            @else
                <x-alert type="warning">
                    <span class="text-lg font-medium">You're subscribed!</span><br>
                    However, your subscription will be ending on {{ $subscription->ends_at->format('Y-m-d') }} ({{ $subscription->ends_at->diffForHumans() }}).
                </x-alert>
            @endunless

            <div>
                All of our billing is handled through Stripe, and you can access their portal below in order to manage your subscription.
            </div>
        @endunless

{{--        @if($promoCode)--}}
{{--            <x-alert type="notice">For being an early-supporter for Fantasy Calendar, you get a discount! Just apply this code while checking out on our billing portal below: <strong>{{ $promoCode }}</strong></x-alert>--}}
{{--        @endif--}}

        <x-slot name="footer">
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 text-right sm:px-6">
                @empty($subscription)
                    @unless(auth()->user()->betaAccess())
                        <x-button-link href="{{ route('subscription.pricing') }}">Get subscribed</x-button-link>
                    @else
                        <x-button-link href="{{ route('subscription.pricing', ['beta_override' => '1']) }}">Subscribe anyway</x-button-link>
                    @endunless
                @else
                    @unless($subscription->onGracePeriod())
                        <x-button-link role="danger" href="{{ route('subscription.cancel') }}">Cancel subscription</x-button-link>
                    @endunless

                    @if($subscription->onGracePeriod())
                        <x-button-link href="{{ route('subscription.resume') }}" class="btn btn-primary form-control">Resume Subscription</x-button-link>
                    @endif

                    @if(!app()->environment(['production']) && $subscription->onGracePeriod())
                        <x-button-link href="{{ route('subscription.cancel') }}" class="btn btn-danger form-control">Immediately end benefits</x-button-link>
                    @endif

                        <x-button-link role="secondary" href="{{ route('profile.billing-portal') }}">Manage your subscription</x-button-link>
                @endunless
            </div>
        </x-slot>
    </x-panel>

        <section aria-labelledby="billing-history-heading">
            <div class="bg-white dark:bg-gray-800 pt-6 shadow sm:rounded-md sm:overflow-hidden">
                <div class="px-4 sm:px-6">
                    <h2 id="billing-history-heading" class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">Billing history</h2>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Here's a quick glance at your last few payments. For more info you can check out <a class="text-primary-600 hover:text-primary-900" href="{{ route('profile.billing-portal') }}">the Stripe billing portal</a>.</p>
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
