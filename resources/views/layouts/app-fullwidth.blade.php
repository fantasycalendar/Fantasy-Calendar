<!DOCTYPE HTML>

<html lang="en">

@include('templates._head_content_tw')

<body class="scrollbar page-{{ str_replace('.', '-', Route::currentRouteName()) }} @stack('page-class') @setting('dark_theme') dark @endsetting">

@if(auth()->check() && request()->session()->has('admin.id'))
    <div class="w-full py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 text-center flex justify-center items-center">
        You are impersonating the user <strong class="ml-1">{{ Auth::user()->username }}</strong>. <a class="rounded-full ml-1 px-1.5 py-0.5 bg-red-600 text-red-200 dark:bg-red-200 dark:text-red-900 text-xs" href="{{ route('admin.reverse_impersonate') }}">Reverse Impersonate</a>
    </div>
@endif

@env('development')
    <div class="w-full py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 text-center">
        This is the beta deployment of Fantasy Calendar. Use with caution.
    </div>
@endenv

<div class="min-h-screen flex flex-col justify-between {{ $attributes->get('body-class') ?? 'bg-gray-100 dark:bg-gray-900' }}" x-data="{ menu: true }">
    <nav class="bg-primary-700 dark:bg-primary-900 border-b border-gray-200 dark:border-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 w-full">
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <a href="{{ config('app.website_url') }}" class="flex items-center text-white dark:text-primary-400">
                            <x-app-logo class="h-8 w-auto" alt="Fantasy Calendar"></x-app-logo> <span class="hidden md:inline pl-2 text-lg font-bold">Fantasy Calendar</span>
                        </a>
                    </div>
                    <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                        <x-nav-link href="{{ route('calendars.index') }}">My Calendars</x-nav-link>
                        <x-nav-link href="{{ route('calendars.create') }}">New Calendar</x-nav-link>
                        <x-nav-link href="{{ route('faq') }}">FAQs</x-nav-link>
                        <x-nav-link href="{{ route('discord') }}">Discord Integration</x-nav-link>
                    </div>
                </div>
                <div class="hidden sm:ml-6 sm:flex sm:items-center">
                    @can('administer-app', auth()->user())
                        <x-nav-link href="{{ route('code16.sharp.home') }}">Admin Panel</x-nav-link>
                    @endcan
                    @auth
                        <x-nav-link href="{{ route('profile') }}">Profile</x-nav-link>
                        <x-nav-link href="{{ route('logout') }}">Logout</x-nav-link>
                    @else
                        <x-nav-link href="{{ route('subscription.pricing') }}">Pricing</x-nav-link>
                        <x-nav-link href="{{ route('login') }}">Login</x-nav-link>
                        <x-nav-link href="{{ route('register') }}">Register</x-nav-link>
                    @endauth
                </div>
                <div class="-mr-2 flex items-center sm:hidden">
                    <!-- Mobile menu button -->
                    <button class="inline-flex items-center justify-center p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white" @click="menu = !menu">
                        <span class="sr-only">Open main menu</span>
                        <!--
                          Heroicon name: menu

                          Menu open: "hidden", Menu closed: "block"
                        -->
                        <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <!--
                          Heroicon name: x

                          Menu open: "block", Menu closed: "hidden"
                        -->
                        <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!--
          Mobile menu, toggle classes based on menu state.

          Open: "block", closed: "hidden"
        -->
        <div class="transition-all duration-400 ease-in-out overflow-hidden md:hidden max-h-0" :class="{ 'max-h-96': !menu,'max-h-0': menu }">
            <div class="pt-2 pb-3 space-y-1">
                <x-mobile-nav-link href="{{ route('calendars.index') }}">My Calendars</x-mobile-nav-link>
                <x-mobile-nav-link href="{{ route('calendars.create') }}">New Calendar</x-mobile-nav-link>
                <x-mobile-nav-link href="{{ route('whats-new') }}">What's new in 2.0</x-mobile-nav-link>
                <x-mobile-nav-link href="{{ route('faq') }}">FAQs</x-mobile-nav-link>

                @can('administer-app', auth()->user())
                    <x-mobile-nav-link href="{{ route('code16.sharp.home') }}">Admin Panel</x-mobile-nav-link>
                @endcan

                @auth
                    <x-mobile-nav-link href="{{ route('profile') }}">Profile</x-mobile-nav-link>
                    <x-mobile-nav-link href="{{ route('logout') }}">Logout</x-mobile-nav-link>
                @else
                    <x-mobile-nav-link href="{{ route('subscription.pricing') }}">Pricing</x-mobile-nav-link>
                    <x-mobile-nav-link href="{{ route('login') }}">Login</x-mobile-nav-link>
                    <x-mobile-nav-link href="{{ route('register') }}">Register</x-mobile-nav-link>
                @endauth
            </div>
        </div>
    </nav>

    <div class="mb-auto">
        {{ $slot }}
    </div>

    @unless($attributes->has('nofooter'))
        <footer class="bg-white dark:bg-gray-800 inset-x-0 bottom-0">
            <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                <div class="flex justify-center space-x-6 md:order-2">
                    <a href="{{ route('discord.server') }}" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                        <span class="sr-only">Discord</span>
                        <i class="fab fa-discord text-lg h-6 w-6"></i>
                    </a>

                    <a href="https://twitter.com/FantasyCalendar" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                        <span class="sr-only">Twitter</span>
                        <i class="fab fa-twitter text-lg h-6 w-6"></i>
                    </a>

                    <a href="https://github.com/fantasycalendar" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                        <span class="sr-only">GitHub</span>
                        <i class="fab fa-github text-lg h-6 w-6"></i>
                    </a>

                    <a href="mailto:contact@fantasy-calendar.com" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                        <span class="sr-only">Email Us</span>
                        <i class="fa fa-envelope text-lg h-6 w-6"></i>
                    </a>

                    <a href="https://fantasycomputer.works/" class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                        <span class="sr-only">Website</span>
                        <i class="fa fa-globe text-lg h-6 w-6"></i>
                    </a>
                </div>
                <div class="mt-8 md:mt-0 md:order-1 text-center md:text-left">
                    <p class="text-base text-gray-400 dark:text-gray-500">&copy; {{ date('Y') }} Fantasy Computerworks Ltd.</p>
                    <p class="text-base text-gray-400 dark:text-gray-500">
                        <a class="text-gray-400 dark:text-gray-500 dark:hover:text-gray-400 hover:text-gray-500" href="{{ route('terms-and-conditions') }}">Terms and Conditions</a>
                            - <a class="text-gray-400 dark:text-gray-500 dark:hover:text-gray-400 hover:text-gray-500" href="{{ route('privacy-policy') }}">Privacy and Cookies Policy</a>
                    </p>
                </div>
            </div>
        </footer>
    @endunless
</div>

<div aria-live="assertive" class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end" x-data="{ notifications: [], notification: function($event){ this.notifications.push($event.detail) } }" @notification.window="notification">
    <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
        <template x-for="(notification, index) in notifications">
            <div class="max-w-sm w-full bg-white dark:bg-gray-700 dark:shadow-xl shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
                 x-data="{
                                info: notification,
                                show:false,
                                init: function() {
                                    setTimeout(() => this.show = true, 100);
                                    setTimeout(() => this.show = false, 3000);
                                    setTimeout(() => delete notifications[index], 4000);
                                },
                                remove: function() {
                                    this.show = false;
                                }
                             }"
                 x-show="show"
                 x-transition:enter="transform ease-out duration-300 transition"
                 x-transition:enter-start="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                 x-transition:enter-end="translate-y-0 opacity-100 sm:translate-x-0"
                 x-transition:leave="transition ease-in duration-100"
                 x-transition:leave-start="opacity-100"
                 x-transition:leave-end="opacity-0">
                <div class="p-4">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <!-- Heroicon name: outline/check-circle -->
                            <svg class="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div class="ml-3 w-0 flex-1 pt-0.5">
                            <p class="text-sm font-medium text-gray-900 dark:text-gray-300" x-text="info.title"></p>
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400" x-text="info.body"></p>
                        </div>
                        <div class="ml-4 flex-shrink-0 flex">
                            <button class="bg-white dark:bg-gray-500 dark:text-gray-800 rounded-md inline-flex text-gray-400 dark:text-gray-800 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" @click="remove">
                                <span class="sr-only">Close</span>
                                <!-- Heroicon name: solid/x -->
                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</div>

</body>
</html>
