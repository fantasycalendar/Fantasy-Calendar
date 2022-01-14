@push('head')
    <script src="{{ mix('js/embed.js') }}"></script>
    <script>
        embedManager = {
            embedNow: true,
            fantasyCalendar: FantasyCalendar({
                hash: '{{ $calendar->hash }}',
                element: '#fantasy-calendar-embed',
                embedNow: false
            })
        }
    </script>
@endpush

<x-app-layout>
    <div class="flex" x-data="embedManager">
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
                <div class="flex items-start pt-8">
                    <div class="flex items-center h-5">
                        <input id="comments" name="comments" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" x-model="embedNow">
                    </div>

                    <div class="ml-3 text-sm">
                        <label for="comments" class="font-medium text-gray-700">Embed Right Away</label>
                        <p class="text-gray-500" x-show="embedNow">The calendar will embed immediately on page load</p>
                        <div class="text-gray-500" x-show="!embedNow">The calendar won't embed until you call <pre class="bg-gray-300 text-gray-400 p-1 rounded-sm">FantasyCalendar.embed()</pre> directly.</div>
                    </div>
                </div>
            </fieldset>

        </div>

        <div class="bg-white overflow-hidden shadow sm:rounded-lg flex-grow">
            <div class="px-4 py-5 sm:p-6">
                <div id="fantasy-calendar-embed"></div>
            </div>
        </div>
    </div>
</x-app-layout>
