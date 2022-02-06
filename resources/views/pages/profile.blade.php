<x-app-layout>
    <!--
      This example requires Tailwind CSS v2.0+

      This example requires some changes to your config:

      ```
      // tailwind.config.js
      const colors = require('tailwindcss/colors')

      module.exports = {
        // ...
        theme: {
          extend: {
            colors: {
              primary: colors.primary,
            },
          },
        },
        plugins: [
          // ...
          require('@tailwindcss/forms'),
        ],
      }
      ```
    -->
    <!--
      This example requires updating your template:

      ```
      <html class="h-full bg-gray-100">
      <body class="h-full">
      ```
    -->
    <div class="h-full">
        <main class="max-w-7xl mx-auto pb-10 lg:px-8">
            <div class="lg:grid lg:grid-cols-12 lg:gap-x-5">
                <aside class="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
                    <nav class="space-y-1">
                        <!-- Current: "bg-gray-50 text-primary-600 hover:bg-white", Default: "text-gray-900 hover:text-gray-900 hover:bg-gray-50" -->
                        <x-left-nav-item icon="cog" label="Account" route="profile"></x-left-nav-item>
                        <x-left-nav-item icon="credit-card" label="Plan & Billing" route="profile.billing"></x-left-nav-item>
                        <x-left-nav-item icon="puzzle-piece" label="Integrations" route="profile.billing"></x-left-nav-item>
                    </nav>
                </aside>

                <!-- Payment details -->
                <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
                    <section aria-labelledby="user-details-heading">
                        <form action="#" method="POST">
                            <div class="shadow sm:rounded-md sm:overflow-hidden">
                                <div class="bg-white dark:bg-gray-800 py-6 px-4 sm:p-6">
                                    <div>
                                        <h2 id="user-details-heading" class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">{{ $user->username }}</h2>
                                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400"><i class="fa fa-user-circle"></i> Registered {{ $user->created_at->format('Y-m-d') }} <i class="fa fa-ellipsis-h px-2"></i> <i class="fa fa-calendar"></i> {{ $user->calendars()->count() }} {{ \Illuminate\Support\Str::plural('Calendar', $user->calendars()->count()) }}</p>
                                    </div>

                                    <div class="mt-6 grid grid-cols-4 gap-6">
                                        <div class="col-span-4 sm:col-span-2">
                                            <x-text-input value="{{ $user->email }}" label="Email Address" type="text" name="email" id="email" autocomplete="email"></x-text-input>
                                        </div>

                                        <div class="col-span-4 sm:col-span-2">
                                            <x-text-input label="Confirm Email" value="{{ $user->email }}" type="text" name="confirm-email" id="confirm-email" autocomplete="email"></x-text-input>
                                        </div>

                                        <div class="col-span-4 sm:col-span-2">
                                            <x-text-input label="New Password" type="text" name="new-password" id="new-password" placeholder="************"></x-text-input>
                                        </div>

                                        <div class="col-span-4 sm:col-span-2">
                                            <x-text-input label="Confirm New Password" type="text" name="confirm-password" id="confirm-password" placeholder="************"></x-text-input>
                                        </div>
                                    </div>
                                </div>
                                <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6">
                                    <x-button type="submit">Save</x-button>
                                </div>
                            </div>
                        </form>
                    </section>

                    <section aria-labelledby="preferences-heading">
                        <form method="POST">
                            @csrf

                            <div class="shadow sm:rounded-md sm:overflow-hidden">
                                <div class="bg-white dark:bg-gray-800 py-6 px-4 sm:p-6">
                                    <div>
                                        <h2 id="preferences-heading" class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">Preferences</h2>
                                    </div>

                                    <div class="mt-6 grid grid-cols-4 gap-6">
                                        <x-input-toggle name="dark_theme" label="Dark theme" description="Your retinas will thank you later." value="{{ $user->setting('dark_theme') ? 'true' : 'false' }}"></x-input-toggle>
                                        <x-input-toggle name="marketing_acceptance" label="Send me product updates" description="We'll only send you stuff when it's a super big deal - No spam here." value="{{ $user->marketing ? 'true' : 'false' }}"></x-input-toggle>
                                    </div>
                                </div>
                                <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6">
                                    <x-button type="submit">Save</x-button>
                                </div>
                            </div>
                        </form>
                    </section>

                    @if(count($invoices))
                        <!-- Billing history -->
                            <section aria-labelledby="billing-history-heading">
                                <div class="bg-white dark:bg-gray-800 pt-6 shadow sm:rounded-md sm:overflow-hidden">
                                    <div class="px-4 sm:px-6">
                                        <h2 id="billing-history-heading" class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">Billing history</h2>
                                    </div>
                                    <div class="mt-6 flex flex-col">
                                        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                                <div class="overflow-hidden border-t border-gray-200 dark:border-gray-600">
                                                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                                        <thead class="bg-gray-50 dark:bg-gray-700">
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
                                                        <tbody class="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                                                            @foreach($invoices as $invoice)
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
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                    @endif
                </div>
            </div>
        </main>
    </div>
</x-app-layout>
