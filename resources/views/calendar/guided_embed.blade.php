@push('head')
    <script src="{{ mix('js/embed.js') }}"></script>
    <script>
        embedManager = {
            embedNow: true,
            hash: '{{ $calendar->hash }}',
            height: 'auto',
            width: 'auto',
            fantasyCalendar: FantasyCalendar({
                hash: '{{ $calendar->hash }}',
                element: '#fantasy-calendar-embed',
                embedNow: false
            })
        }
    </script>
@endpush

<x-app-layout>
    <div class="flex" x-data="embedManager" x-init="fantasyCalendar.embed('#fantasy-calendar-embed')">
        <div class="hidden md:block max-w-sm w-full md:mr-4 space-y-8 divide-y divide-gray-200">
            <div>
                <div class="text-lg font-medium leading-6 text-gray-900">
                    Create your embed code
                </div>
                <div class="mt-1 text-sm text-gray-600">
                    Then paste it where you want it. It's that simple.
                </div>
            </div>

            <fieldset>
                <div class="grid grid-cols-6 gap-6">
                    <div class="pt-8 col-span-6">
                        <label for="calendar-hash" class="block font-medium text-gray-700">Calendar hash</label>
                        <input type="text" name="calendar-hash" id="calendar-hash" autocomplete="street-address" class="mt-1 text-gray-600 focus:ring-green-500 focus:border-green-500 block leading-loose w-full px-2 shadow-sm border-gray-300 rounded-md" x-model="hash">
                    </div>

                    <div class="pt-2 col-span-3">
                        <label for="calendar-hash" class="block font-medium text-gray-700">Height</label>
                        <input type="text" name="calendar-hash" id="calendar-hash" autocomplete="street-address" class="mt-1 text-gray-600 focus:ring-green-500 focus:border-green-500 block leading-loose w-full px-2 shadow-sm border-gray-300 rounded-md" x-model="height">
                    </div>

                    <div class="pt-2 col-span-3">
                        <label for="calendar-hash" class="block font-medium text-gray-700">Width</label>
                        <input type="text" name="calendar-hash" id="calendar-hash" autocomplete="street-address" class="mt-1 text-gray-600 focus:ring-green-500 focus:border-green-500 block leading-loose w-full px-2 shadow-sm border-gray-300 rounded-md" x-model="width">
                    </div>
                </div>
            </fieldset>

            <fieldset>
                <div class="pt-8">
                    <label for="calendar-hash" class="block font-medium text-gray-700">Element Selector</label>
                    <input :disabled="embedNow" type="text" name="calendar-hash" id="calendar-hash" autocomplete="street-address" :title="embedNow ? 'Only applicable if embedding manually' : ''" class="disabled:text-gray-500 disabled:bg-gray-300 mt-1 text-gray-600 focus:ring-green-500 focus:border-green-500 block leading-loose w-full px-2 shadow-sm border-gray-300 rounded-md" x-model="hash">
                </div>

                <div class="flex items-start pt-8">
                    <div class="flex items-center h-5">
                        <input id="comments" name="comments" type="checkbox" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" x-model="embedNow">
                    </div>

                    <div class="ml-3 text-sm flex-grow">
                        <label for="comments" class="font-medium text-gray-800">Embed Right Away</label>
                        <p class="text-gray-600 w-full" x-show="embedNow">The calendar will embed immediately on page load</p>
                        <div class="text-gray-600 w-full" x-show="!embedNow">The calendar won't embed until you call <pre class="my-2 p-2 w-full bg-gray-200 text-gray-800 p-1 rounded-sm">FantasyCalendar.embed()</pre></div>
                    </div>
                </div>
            </fieldset>

        </div>

        <div class="bg-white overflow-hidden shadow sm:rounded-lg flex-grow">
            <div class="px-4 py-5 sm:p-6">
                <div style="height: 500px">
                    <div id="fantasy-calendar-embed"></div>
                </div>

                <x-button size="lg" @click="$dispatch('modal')"></x-button>
            </div>
        </div>
    </div>

    <x-modal>
        Test
    </x-modal>
</x-app-layout>
