@push('head')
    <script src="{{ mix('js/embed.js') }}"></script>
    <script>
        function manageEmbed() {
            return {
                embedNow: true,
                hash: '{{ $calendar->hash }}',
                size: 'auto',
                height: '',
                width: '',
                selector: '',
                loading: false,
                theme: 'fantasy_calendar',
                fantasyCalendar: null,
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

                    this.$watch('size', value => this.settingRefreshes('size', value))
                    this.$watch('theme', value => this.updateSetting('theme', value))
                },
                settingRefreshes: function(name, value) {
                    if(name === 'size' && value === 'auto') {
                        this.updateSetting('height', 'removeSetting');
                        this.updateSetting('width', 'removeSetting');
                    }

                    if(name === 'size' && value === 'custom') {
                        if (this.width.length) this.updateSetting('width', this.width);
                        if (this.height.length) this.updateSetting('height', this.height);
                    }

                    if(!this.updateSetting(name, value)) return;

                    this.loading = true;

                    this.refreshIframe();
                },
                refreshIframe: function(){
                    this.fantasyCalendar.embed();
                },
                updateSetting: function(name, value) {
                    if(this.fantasyCalendar.config(name) === value) {
                        return false;
                    }

                    this.fantasyCalendar.config(name, value);
                    return true;
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

                <div :class="{ 'animate-spin': loading }" class="absolute text-xl top-0 right-0 p-2 cursor-pointer text-gray-400 hover:text-gray-600 transition transition-color duration-300 ease-in-out" @click="refreshIframe">
                    <i class="fa fa-sync"></i>
                </div>
            </div>

            <fieldset>
                <div class="grid grid-cols-6 gap-4">
                    <div class="pt-8 col-span-6">
                        <label for="calendar-hash" class="block font-medium text-gray-700">Calendar hash</label>
                        <input type="text" name="calendar-hash" id="calendar-hash" class="mt-1 text-gray-600 focus:ring-green-500 focus:border-green-500 block leading-loose w-full px-2 shadow-sm border-gray-300 rounded-md" x-model="hash">
                    </div>

                    <div class="pt-2 col-span-6">
                        <label for="calendar-theme" class="block font-medium text-gray-700">Theme</label>
                        <x-select-menu model="theme" default="fantasy_calendar" :options="$themes"></x-select-menu>
                    </div>

                    <div class="pt-2 col-span-6">
                        <x-select-menu model="size" default="auto" :options="$sizes">
                            Size
                        </x-select-menu>
                    </div>

                    <div class="pt-2 col-span-3" x-show="size == 'custom'">
                        <label for="calendar-height" class="block font-medium text-gray-700">Height</label>
                        <input placeholder="auto" type="number" min="150" max="1080" name="calendar-height" id="calendar-height" class="mt-1 text-gray-600 focus:ring-green-500 focus:border-green-500 block leading-loose w-full px-2 shadow-sm border-gray-300 rounded-md" x-model="height" @keyup.debounce.500ms="settingRefreshes('height', $el.value)">
                    </div>

                    <div class="pt-2 col-span-3" x-show="size == 'custom'">
                        <label for="calendar-width" class="block font-medium text-gray-700">Width</label>
                        <input placeholder="auto" type="number" min="300" max="1920" name="calendar-width" id="calendar-width" class="mt-1 text-gray-600 focus:ring-green-500 focus:border-green-500 block leading-loose w-full px-2 shadow-sm border-gray-300 rounded-md" x-model="width" @keyup.debounce.500ms="settingRefreshes('width', $el.value)">
                    </div>
                </div>

                <div class="pt-8">
                    <label for="element_selector" class="block font-medium text-gray-700">Element Selector</label>
                    <input type="text" name="element_selector" id="element_selector" placeholder="#fantasy-calendar-embed" class="disabled:text-gray-500 disabled:bg-gray-300 mt-1 text-gray-600 focus:ring-green-500 focus:border-green-500 block leading-loose w-full px-2 shadow-sm border-gray-300 rounded-md" x-model="selector">

                    <x-alert type="notice" class="mt-4" x-show="!selector">
                        Without a selector, the <strong>&lt;script&gt;</strong> tag calling <strong>FantasyCalendar({})</strong> will be replaced.
                    </x-alert>
                </div>

                <div class="flex items-start pt-8">
                    <div class="flex items-center h-5">
                        <input id="comments" name="comments" type="checkbox" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded" x-model="embedNow">
                    </div>

                    <div class="ml-3 text-sm flex-grow">
                        <label for="comments" class="font-medium text-gray-800">Embed Right Away</label>
                        <p class="text-gray-600 pt-1 w-full" x-show="embedNow"> The calendar will embed immediately on page load</p>
                    </div>
                </div>

                <x-alert type="warning" x-show="!embedNow" class="mt-4">The calendar won't embed until you call <pre class="my-2 p-2 w-full bg-gray-200 text-gray-800 p-1 rounded-sm">FantasyCalendar.embed()</pre></x-alert>
            </fieldset>

        </div>

        <div class="bg-white overflow-hidden shadow sm:rounded-lg flex-grow">
            <div class="px-4 py-5 sm:p-6 overflow-auto">
                <div style="height: 500px">
                    <div id="fantasy-calendar-embed"></div>
                </div>

                <div class="text-left bg-gray-800 rounded p-4 leading-8 mt-6 min-w-full text-gray-200 font-mono">
                    <div>{{ "<script src='" . mix('js/embed.js') . "'></script>" }}</div>
                    <div>&lt;script&gt;</div>
                    <div class="pl-6">FantasyCalendar({</div>
                        <div class="pl-12">hash: '<span x-text="hash"></span>',</div>
                        <div class="pl-12" x-show="!['#fantasy-calendar-embed', '', '#', '.'].includes(selector)">selector: '<span x-text="selector"></span>'</div>
                        <div class="pl-12" x-show="!embedNow">embedNow: false,</div>
                        <div class="pl-12" x-show="size !== 'auto'">size: '<span x-text="size"></span>',</div>
                        <div x-show="size === 'custom'">
                            <div class="pl-12" x-show="width">width: <span x-text="width"></span>,</div>
                            <div class="pl-12" x-show="height">height: <span x-text="height"></span>,</div>
                        </div>
                    <div class="pl-6">});</div>
                    <div>&lt;/script&gt;</div>
                </div>

            </div>
        </div>
    </div>
</x-app-layout>
