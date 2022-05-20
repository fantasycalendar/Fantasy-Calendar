<div class="fixed inset-0 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true" x-cloak x-show="{{ $attributes->get('model') }}">
    <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 dark:bg-opacity-75 bg-opacity-75 transition-opacity" aria-hidden="true"
             x-transition:enter="ease-in-out duration-500"
             x-transition:enter-start="opacity-0"
             x-transition:enter-end="opacity-100"
             x-transition:leave="ease-in-out duration-500"
             x-transition:leave-start="opacity-100"
             x-transition:leave-end="opacity-0"
             x-show="{{ $attributes->get('model') }}"
        ></div>

        <div class="absolute inset-0" aria-hidden="true" x-show="{{ $attributes->get('model') }}">
            <div @click.away="{{ $attributes->get('model') }} = false" class="fixed inset-y-0 pl-16 max-w-full right-0 flex">
                <div class="w-screen max-w-md"
                     x-show="{{ $attributes->get('model') }}"
                     x-transition:enter="transform transition ease-in-out duration-500 sm:duration-700"
                     x-transition:enter-start="translate-x-full"
                     x-transition:enter-end="translate-x-0"
                     x-transition:leave="transform transition ease-in-out duration-500 sm:duration-700"
                     x-transition:leave-start="translate-x-0"
                     x-transition:leave-end="translate-x-full"
                >
                    <form class="h-full divide-y divide-gray-200 dark:divide-gray-700 flex flex-col bg-white dark:bg-gray-800 shadow-xl" @submit.prevent>
                        <div class="flex-1 h-0 overflow-y-auto scrollbar">
                            @isset($title)
                                <div class="py-6 px-4 bg-primary-700 dark:bg-primary-900 sm:px-6">
                                    <div class="flex items-center justify-between">
                                        <h2 class="text-lg font-medium text-white dark:text-gray-200" id="slide-over-title">
                                            {{ $title }}
                                        </h2>
                                        <div class="ml-3 h-7 flex items-center">
                                            <button type="button" class="bg-primary-700 dark:bg-primary-700 dark:text-primary-900 dark:hover:bg-primary-600 rounded-md text-primary-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-primary-600" @click="{{ $attributes->get('model') }} = false">
                                                <span class="sr-only">Close panel</span>
                                                <!-- Heroicon name: outline/x -->
                                                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    @isset($description)
                                        <div class="mt-1">
                                            <p class="text-sm text-primary-300">
                                                {{ $description }}
                                            </p>
                                        </div>
                                    @endisset
                                </div>
                            @endisset

                            <div class="flex-1 flex flex-col justify-between">
                                <div class="px-4 sm:px-6">
                                    <div class="space-y-6 pt-6 pb-5 divide-y divide-gray-200 dark:divide-gray-700">
                                        {{ $slot }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex-shrink-0 px-4 py-4 flex justify-end space-x-4">
                            @unless($footer)
                                <button @click="{{ $attributes->get('model') }} = false" type="button" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    Cancel
                                </button>
                                <button type="submit" class="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    Save
                                </button>
                            @else
                                {{ $footer }}
                            @endunless
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
