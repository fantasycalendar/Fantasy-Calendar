@push('head')
    <script src="{{ mix('js/embed.js') }}"></script>
    <script>
        function manageEmbed() {
            return {
                embedNow: true,
                hash: '{{ $calendar->hash }}',
                size: 'auto',
                height: 'auto',
                width: 'auto',
                selector: '',
                loading: false,
                init: function() {

                    this.$nextTick(function() {
                        this.fantasyCalendar = FantasyCalendar({
                            hash: '{{ $calendar->hash }}',
                            element: '#fantasy-calendar-embed',
                            size: this.size,
                            onUpdate: () => this.loading = false,
                            onLoad: () => this.loading = false
                        });
                    }.bind(this));
                    this.$watch('size', value => this.update('size', value))
                },
                fantasyCalendar: null,
                get code(){
                    let embedCode = "FantasyCalendar(\n\thash: '"+this.hash+"'\n";

                    if(!['#fantasy-calendar-embed', '', '#', '.'].includes(this.selector)) {
                        embedCode += `\tselector: '${this.selector}'\n`;
                    }

                    if(!this.embedNow) {
                        embedCode += `\tembedNow: false\n`;
                    }

                    return embedCode + ")";
                },
                update: function(name, value) {
                    if(name && value) {
                        this.fantasyCalendar.config(name, value);
                    }

                    this.loading = true;

                    // setTimeout(() => this.loading = false, 1000);

                    this.fantasyCalendar.embed();
                }
            }
        }
    </script>
@endpush

<x-app-layout>
    <div class="flex" x-data="manageEmbed()">
        <div class="hidden md:block max-w-sm w-full md:mr-4 space-y-8 divide-y divide-gray-200">
            <div class="relative">
                <div class="text-lg font-medium leading-6 text-gray-900">
                    Create your embed code
                </div>
                <div class="mt-1 text-sm text-gray-600">
                    Then paste it where you want it. It's that simple.
                </div>

                <div :class="{ 'animate-spin': loading }" class="absolute text-xl top-0 right-0 p-2 cursor-pointer text-gray-400 hover:text-gray-600 transition transition-color duration-300 ease-in-out" @click="update">
                    <i class="fa fa-sync"></i>
                </div>
            </div>

            <fieldset>
                <div class="grid grid-cols-6 gap-6">
                    <div class="pt-8 col-span-6">
                        <label for="calendar-hash" class="block font-medium text-gray-700">Calendar hash</label>
                        <input type="text" name="calendar-hash" id="calendar-hash" class="mt-1 text-gray-600 focus:ring-green-500 focus:border-green-500 block leading-loose w-full px-2 shadow-sm border-gray-300 rounded-md" x-model="hash">
                    </div>

                    <div class="pt-2 col-span-6">
                        <x-select-menu model="size" default="auto" :options="[
                                'auto' => 'Autofill available space',
                                'xs' => 'Tiny',
                                'sm' => 'Small',
                                'md' => 'Medium',
                                'lg' => 'Large',
                                'xl' => 'Extra Large',
                                '2xl' => 'Double Extra Large',
                                '3xl' => 'Triple Extra Large',
                                'custom' => 'Custom size'
                            ]">
                            Size
                        </x-select-menu>
                    </div>

                    <div class="pt-2 col-span-3" x-show="size == 'custom'">
                        <label for="calendar-hash" class="block font-medium text-gray-700">Height</label>
                        <input type="text" name="calendar-hash" id="calendar-hash" class="mt-1 text-gray-600 focus:ring-green-500 focus:border-green-500 block leading-loose w-full px-2 shadow-sm border-gray-300 rounded-md" x-model="height">
                    </div>

                    <div class="pt-2 col-span-3" x-show="size == 'custom'">
                        <label for="calendar-hash" class="block font-medium text-gray-700">Width</label>
                        <input type="text" name="calendar-hash" id="calendar-hash" class="mt-1 text-gray-600 focus:ring-green-500 focus:border-green-500 block leading-loose w-full px-2 shadow-sm border-gray-300 rounded-md" x-model="width">
                    </div>
                </div>

                <div class="pt-8">
                    <label for="element_selector" class="block font-medium text-gray-700">Element Selector</label>
                    <input type="text" name="element_selector" id="element_selector" placeholder="#fantasy-calendar-embed" class="disabled:text-gray-500 disabled:bg-gray-300 mt-1 text-gray-600 focus:ring-green-500 focus:border-green-500 block leading-loose w-full px-2 shadow-sm border-gray-300 rounded-md" x-model="selector">
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

{{--                Theme dropdown--}}
            </fieldset>

        </div>

        <div class="bg-white overflow-hidden shadow sm:rounded-lg flex-grow">
            <div class="px-4 py-5 sm:p-6 overflow-auto">
                <div style="height: 500px">
                    <div id="fantasy-calendar-embed"></div>
                </div>

                <pre class="text-left bg-gray-800 rounded p-4 leading-8 mt-6 min-w-full text-gray-200"><code class="language-html">{{ "<script src='" . mix('js/embed.js') . "'></script>" }}
&lt;script&gt;
<span x-text="code"></span>
&lt;/script&gt;
</code></pre>

            </div>
        </div>
    </div>
</x-app-layout>
