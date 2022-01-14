
<!DOCTYPE HTML>

<html lang="en">

@include('templates._head_content_tw')

<body class="page-{{ str_replace('.', '-', Route::currentRouteName()) }} @stack('page-class')">

<div class="min-h-screen bg-gray-100" x-data="{ menu: true }">
    <nav class="bg-green-700 border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 w-full">
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <a href="{{ route('home') }}" class="flex items-center">
                            <img class="h-8 w-auto" src="{{ asset('resources/header_logo.png') }}" alt="Fantasy Calender"> <span class="hidden md:inline pl-2 text-lg font-bold text-white">Fantasy Calendar</span>
                        </a>
                    </div>
                    <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                        <x-nav-link href="{{ route('calendars.index') }}">My Calendars</x-nav-link>
                        <x-nav-link href="{{ route('calendars.create') }}">New Calendar</x-nav-link>
                        <x-nav-link href="{{ route('whats-new') }}">What's new in 2.0</x-nav-link>
                        <x-nav-link href="{{ route('faq') }}">FAQs</x-nav-link>
                    </div>
                </div>
                <div class="hidden sm:ml-6 sm:flex sm:items-center">
                    @auth
                        <x-nav-link href="{{ route('profile') }}">Profile</x-nav-link>
                        <x-nav-link href="{{ route('logout') }}">Logout</x-nav-link>
                    @else
                        <x-nav-link href="{{ route('pricing') }}">Pricing</x-nav-link>
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
                @auth
                    <x-mobile-nav-link href="{{ route('profile') }}">Profile</x-mobile-nav-link>
                    <x-mobile-nav-link href="{{ route('logout') }}">Logout</x-mobile-nav-link>
                @else
                    <x-mobile-nav-link href="{{ route('pricing') }}">Pricing</x-mobile-nav-link>
                    <x-mobile-nav-link href="{{ route('login') }}">Login</x-mobile-nav-link>
                    <x-mobile-nav-link href="{{ route('register') }}">Register</x-mobile-nav-link>
                @endauth
            </div>
        </div>
    </nav>

    <div class="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        @yield('content')
    </div>
</div>

</body>
</html>
