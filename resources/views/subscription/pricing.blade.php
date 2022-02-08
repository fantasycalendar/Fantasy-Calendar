<x-app-fullwidth-layout body-class="bg-white dark:bg-gray-900">
    <div class="h-full bg-white">
        <div class="bg-gray-100 dark:bg-gray-800">
            <div class="pt-12 sm:pt-16 lg:pt-20">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center">
                        <h2 class="text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl lg:text-5xl">Subscribe to Fantasy Calendar</h2>
                        <p class="mt-4 text-xl text-gray-600 dark:text-gray-300">If you're not satisfied, <a class="text-primary-600 hover:text-primary-700" href="mailto:contact@fantasy-calendar.com">contact us</a> within the first 14 days and we'll gladly send you a full refund.</p>
                    </div>
                </div>
            </div>
            <div class="mt-8 bg-white dark:bg-gray-900 pb-16 sm:mt-12 sm:pb-20 lg:pb-28">
                <div class="relative">
                    <div class="absolute inset-0 h-1/2 bg-gray-100 dark:bg-gray-800"></div>
                    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="max-w-lg mx-auto rounded-lg shadow-lg dark:shadow-slate-800 overflow-hidden lg:max-w-none lg:flex">
                            <div class="flex-1 bg-white dark:bg-gray-900 px-6 py-8 lg:p-12">
                                <h3 class="text-2xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-3xl">Another Subscription?</h3>
                                <p class="mt-6 text-base text-gray-500 dark:text-gray-300">We hear you! Yet another monthly subscription to add to the list. <br><br> However, Fantasy Calendar is an <a href="https://github.com/fantasycalendar/Fantasy-Calendar" class="text-primary-600 hover:text-primary-700">open source</a> hobby project maintained by two developers in our free time, and we've made sure the cost is as low as we can get it. Your subscription helps us buy tools and software, pay our bills, <i>and</i> gets you this cool stuff:</p>
                                <div class="mt-8">
                                    <div class="flex items-center">
                                        <h4 class="flex-shrink-0 pr-4 bg-white dark:bg-gray-900 text-sm tracking-wider font-semibold uppercase text-primary-600">What's included</h4>
                                        <div class="flex-1 border-t-2 border-gray-200 dark:border-gray-700"></div>
                                    </div>
                                    <ul role="list" class="mt-8 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5">
                                        @foreach([
                                            'Full calendar functionality',
                                            'Unlimited number of calendars',
                                            'User Management<p class="text-xs text-gray-500 dark:text-gray-400">Users can comment on events and view provided information</p>',
                                            'Calendar co-ownership<p class="text-xs text-gray-500 dark:text-gray-400">Let others create and comment on events, and control the date</p>',
                                            'Calendar Linking<p class="text-xs text-gray-500 dark:text-gray-400">Have one parent calendar drive the dates of many others</p>',
                                            'Discord Integration <span class="text-xs text-primary-600 dark:text-primary-600"><a href="' . route('discord') . '">(more info)</a></span><p class="text-xs text-gray-500 dark:text-gray-400">Use your calendars directly within your Discord servers</p>',
                                            'Calendar embedding<p class="text-xs text-gray-500 dark:text-gray-400">Show off your calendars on your own websites</p>',
                                            '<small><i>...and more to come!</i></small>',
                                        ] as $benefit)
                                            <li class="flex items-start lg:col-span-1">
                                                <div class="flex-shrink-0">
                                                    <!-- Heroicon name: solid/check-circle -->
                                                    <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div class="ml-3 text-sm text-gray-700 dark:text-gray-300">{!! $benefit !!}</div>
                                            </li>
                                        @endforeach
                                    </ul>
                                </div>
                            </div>
                            <div class="py-8 px-6 text-center bg-gray-50 dark:bg-gray-900 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
                                <p class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Subscribe monthly</p>
                                <div class="mt-4 flex items-center justify-center text-5xl font-extrabold text-gray-900 dark:text-white">
                                    <span> $2.49 </span>
                                    <span class="ml-3 text-xl font-medium text-gray-500 dark:text-gray-300"> USD </span>
                                </div>
                                <p class="mt-4 text-sm">
                                    <a href="#" class="font-medium text-gray-500 dark:text-gray-300 underline"> Terms and conditions </a>
                                </p>
                                <div class="mt-6">
                                    <div class="rounded-md shadow">
                                        <a href="#" class="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-800 hover:bg-primary-900"> Get Access </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-fullwidth-layout>
