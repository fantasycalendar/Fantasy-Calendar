<x-app-guest-layout body-class="bg-gray-800 dark">
    <div class="my-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
        <div class="text-center">
            <h1 class="text-4xl tracking-tight font-extrabold text-gray-300 sm:text-5xl md:text-6xl">
                <span class="block">Build a calendar that</span>
                <span class="block text-primary-600">fits your world</span>
            </h1>
            <p class="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">Whether you're a GM just here to track your Forgotten Realms campaign with a preset world, or a fanciful world-builder with 12 moons (Like Eberron's) and zany timekeeping systems to match, we've got you covered.</p>
        </div>
    </div>

    <div class="relative pb-32">
        <div class="absolute inset-0 flex flex-col" aria-hidden="true">
            <div class="flex-1"></div>
            <div class="flex-1 w-full bg-gray-900"></div>
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
            <img class="relative rounded-lg shadow-lg shadow-slate-800" src="{{ asset('/resources/screenshots/forgotten-realms-homepage-screenshot.png') }}" alt="App screenshot">
        </div>
    </div>

    <!-- This example requires Tailwind CSS v2.0+ -->
    <div class="bg-gray-900">
        <!-- Header -->
        <div class="relative pb-32 bg-gray-800">
            <div class="absolute inset-0">
                <img class="w-full h-full object-cover" src="{{ asset('/resources/homepage/castle.jpg') }}" alt="">
                <div class="absolute inset-0 bg-gray-700 mix-blend-multiply" aria-hidden="true"></div>
            </div>
            <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                <h1 class="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">Level up your narrative</h1>
                <p class="mt-6 max-w-3xl text-xl text-gray-300">All the tools you need to make your world feel like a living, breathing place where life happens around your players, always ready for the question "How long has it been since...?"</p>
            </div>
        </div>

        <!-- Overlapping cards -->
        <section class="-mt-32 max-w-7xl mx-auto relative z-10 pb-32 px-4 sm:px-6 lg:px-8" aria-labelledby="contact-heading">
            <h2 class="sr-only" id="contact-heading">Powerful Calendar Engine</h2>
            <div class="grid grid-cols-1 gap-y-20 lg:grid-cols-3 lg:gap-y-0 lg:gap-x-8">
                <div class="flex flex-col bg-gray-700 rounded-2xl shadow-xl shadow-slate-800">
                    <div class="flex-1 relative pt-16 px-6 pb-8 md:px-8">
                        <div class="absolute top-0 p-5 inline-block bg-primary-600 rounded-xl shadow-lg transform -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-medium text-gray-200">Powerful Calendar Engine</h3>
                        <p class="mt-4 text-base text-gray-300">This flexible calendar engine can accommodate whatever your world needs — intercalaries, leap days, moons cycles, seasons, eras, and more!</p>
                    </div>
                </div>

                <div class="flex flex-col bg-gray-700 rounded-2xl shadow-xl shadow-slate-800">
                    <div class="flex-1 relative pt-16 px-6 pb-8 md:px-8">
                        <div class="absolute top-0 p-5 inline-block bg-primary-600 rounded-xl shadow-lg transform -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-medium text-gray-200">Easy to Use</h3>
                        <p class="mt-4 text-base text-gray-300">Fantasy Calendar has been lovingly hand-crafted to make sense. With detailed documentation to help clear the complicated things up even further.</p>
                    </div>
                </div>

                <div class="flex flex-col bg-gray-700 rounded-2xl shadow-xl shadow-slate-800">
                    <div class="flex-1 relative pt-16 px-6 pb-8 md:px-8">
                        <div class="absolute top-0 p-5 inline-block bg-primary-600 rounded-xl shadow-lg transform -translate-y-1/2">
                            <!-- Heroicon name: outline/newspaper -->
                            <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-medium text-gray-200">A Labor of Love</h3>
                        <p class="mt-4 text-base text-gray-300">We have separate day jobs, and work on Fantasy Calendar in our spare time. That's because it's something we want to use! As such, we plan to keep improving it.</p>
                    </div>
                </div>
            </div>
        </section>
    </div>


    <!-- This example requires Tailwind CSS v2.0+ -->
    <div class="relative bg-gray-900 pb-32 overflow-hidden">
        <div class="relative">
            <div class="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
                <div class="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
                    <div>
                        <div>
                        <span class="h-12 w-12 rounded-md flex items-center justify-center bg-primary-600">
                          <!-- Heroicon name: outline/inbox -->
                          <i class="fa fa-history w-6 h-6 text-white text-center text-xl"></i>
                        </span>
                        </div>
                        <div class="mt-6">
                            <h2 class="text-3xl font-extrabold tracking-tight text-gray-200">Never lose track of campaign events</h2>
                            <p class="mt-4 text-lg text-gray-400">When a shopkeep tells your players "I'll see you in a week!", do you know when to follow up? What if it's 6 months? Well, with Fantasy Calendar you can track that in-universe, keeping time down to the hour and minute.</p>
                            <div class="mt-6">
                                <a href="{{ route('calendars.create') }}" class="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-slate-700 shadow-sm text-white bg-primary-600 hover:bg-primary-700"> Get started </a>
                            </div>
                        </div>
                    </div>
                    <div class="mt-8 border-t border-gray-600 pt-6">
                        <blockquote>
                            <div>
                                <p class="text-base text-gray-400">&ldquo;If you adventurers take care of those threats to our livelihood, we'll build you a keep. It'll take 100 days.&rdquo;</p>
                            </div>
                            <footer class="mt-3">
                                <div class="flex items-center space-x-3">
                                    <div class="flex-shrink-0">
                                        <img class="h-6 w-6 rounded-full" src="{{ asset('/resources/homepage/dwarf-profile-photo.jpg') }}" alt="">
                                    </div>
                                    <div class="text-base font-medium text-gray-500">Nimoor Mithtel, leader of the Greycross Dwarves</div>
                                </div>
                            </footer>
                        </blockquote>
                    </div>
                </div>
                <div class="mt-12 sm:mt-16 lg:mt-0">
                    <div class="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                        <img class="w-full rounded-xl shadow-xl shadow-slate-800 ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none" src="{{ asset('/resources/screenshots/taldorei-never-lose-track.png') }}" alt="Inbox user interface">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="relative bg-gray-800 pb-16 overflow-hidden">
        <div class="mt-24">
            <div class="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
                <div class="px-4 max-w-xl mx-auto sm:px-6 lg:py-32 lg:max-w-none lg:mx-0 lg:px-0 lg:col-start-2">
                    <div>
                        <div>
                            <span class="h-12 w-12 rounded-md flex items-center justify-center bg-primary-600">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                        </div>
                        <div class="mt-6">
                            <h2 class="text-3xl font-extrabold tracking-tight text-gray-200">Detailed weather with custom climates</h2>
                            <p class="mt-4 text-lg text-gray-400">Don't just run a story, paint a <strong>world</strong>, with weather that varies throughout the year. Wow your players with cinematic descriptions of sweltering heat, driving snow, eerie fog, or driving rainstorms - Just create some locations, no weather dice tables required.</p>
                            <div class="mt-6">
                                <a href="{{ route('calendars.create') }}" class="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"> Get started </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-12 sm:mt-16 lg:mt-0 lg:col-start-1">
                    <div class="pr-4 -ml-48 sm:pr-6 md:-ml-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                        <img class="w-full rounded-xl shadow-xl shadow-slate-900 ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none" src="{{ asset('/resources/screenshots/weather-zoom.png') }}" alt="Weather for the year">
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-guest-layout>
