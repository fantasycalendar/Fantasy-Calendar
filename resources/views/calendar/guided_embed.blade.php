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
                theme: 'custom',
                fantasyCalendar: null,
                notifications: [],
                openSidebar: true,
                theme_settings: {
                    background_color: '',
                },
                theme_editing: {
                    background_color: '',
                    shadow_color: '',
                    border_color: '',
                    current_date_color: '',
                    placeholder_background_color: '',
                    heading_text_color: '',
                    text_color: '',
                    inactive_text_color: '',
                },
                theme_originals: @json($themeValues),
                theme_edited: {},
                get embedCode() {
                    const embedUrl = '{{ url('js/embed.js') }}';

                    let code = "<"+"script src='"+embedUrl+"'></script" + ">\n<" + "script>\n"; // This is broken up to stop phpstorm from parsing it as code.
                        code += `FantasyCalendar({\n\thash: '${this.hash}',\n`;
                        code += !['#fantasy-calendar-embed', '', '#', '.'].includes(this.selector)  ? "\tselector: '" + this.selector + "',\n"  : '';
                        code += !this.embedNow                                                      ? "\tembedNow: false,\n"                    : '';

                        if(this.size !== 'auto' || this.theme !== 'fantasy_calendar') {
                            code += `\tsettings: {\n`;
                                code += this.theme !== 'fantasy_calendar'        ? "\t\ttheme: '" + this.theme + "',\n"      : '';
                                code += this.size !== 'auto'                     ? "\t\tsize: '" + this.size + "',\n"        : '';
                                code += this.size === 'custom' && this.width     ? "\t\twidth: '" + this.width + "',\n"      : '';
                                code += this.size === 'custom' && this.height    ? "\t\theight: '" + this.height + "',\n"    : '';

                                if(this.theme === 'custom' && Object.entries(this.theme_edited).length) {
                                    for (const [key, value] of Object.entries(this.theme_edited)) {
                                        if(['font_name', 'shadow_strength'].includes(key)) continue;

                                        code += `\t\t${key}: '${value}',\n`
                                    }
                                }

                            code += `\t},\n`;
                        }

                    code += "});\n<"+"/script>";

                    return code;
                },
                init: function() {
                    this.theme_editing = clone(this.theme_originals)

                    this.$nextTick(function() {
                        let hash = '{{ $calendar->hash }}';
                        this.fantasyCalendar = FantasyCalendar({
                            hash: hash,
                            selector: '#fantasy-calendar-embed',
                            settings: {
                                size: this.size,
                                onUpdate: () => this.loading = false,
                                onLoad: () => this.loading = false
                            }
                        });
                        this.$watch('size', value => this.settingRefreshes('size', value))
                        this.$watch('theme', (value, oldValue) => this.updateTheme('theme', value, oldValue))
                        console.log(this.embedCode);
                    }.bind(this));
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
                cancelTheme: function() {
                    this.openSidebar = false;
                },
                persistTheme: function() {
                    console.log(JSON.parse(JSON.stringify(this.theme_editing)));
                    this.theme_edited = {};
                    for (const [key, value] of Object.entries(this.theme_editing)) {
                        if(this.theme_originals[key].value === value.value) continue;
                        console.log(this.theme_originals[key].value, value.value);
                        this.theme_edited[key] = value.value;
                    }
                    this.fantasyCalendar.settings(JSON.parse(JSON.stringify(this.theme_edited)));
                    console.log(JSON.parse(JSON.stringify(this.theme_edited)));
                },
                updateTheme: function(name, value, oldValue) {
                    console.log(name, value, oldValue);
                    if(value !== 'custom' && oldValue === 'custom') {
                        this.theme_editing = clone(this.theme_originals);
                        this.persistTheme();
                    }

                    this.updateSetting(name, value);
                },
                updateSetting: function(name, value) {
                    if(this.fantasyCalendar.setting(name) === value) {
                        return false;
                    }

                    this.fantasyCalendar.setting(name, value);
                    return true;
                },
                copyCode: function() {
                    let range = document.createRange();
                    range.setStart(this.$refs.codeBlock.firstChild, 0);
                    range.setEnd(this.$refs.codeBlock.firstChild, this.$refs.codeBlock.firstChild.length);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);

                    navigator.clipboard.writeText(this.embedCode);

                    this.notify('Copied', 'Your code has been copied')
                },
                notify: function(title, body) {
                    this.notifications.push({
                        title, body
                    });
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
                <div class="grid grid-cols-6 gap-4 items-center">
                    <div class="pt-8 col-span-6">
                        <label for="calendar-hash" class="block font-medium text-gray-700">Calendar hash</label>
                        <input type="text" name="calendar-hash" id="calendar-hash" class="mt-1 text-gray-600 focus:ring-primary-500 focus:border-primary-500 block w-full px-2 shadow-sm border-gray-300 rounded-md" x-model="hash">
                    </div>

                    <div class="pt-2 col-span-6">
                        <label for="calendar-theme" class="block font-medium text-gray-700">Theme</label>
                        <x-select-menu model="theme" default="custom" :options="$themes"></x-select-menu>
                    </div>

                    <div class="pt-2 col-span-6" x-show="theme === 'custom'">
                        <x-button class="w-full justify-center shadow-sm border-gray-300" @click="openSidebar = true" role="secondary">
                            Customize theme
                        </x-button>
                    </div>

                    <div class="pt-2 col-span-6">
                        <x-select-menu model="size" default="auto" :options="$sizes">
                            Size
                        </x-select-menu>
                    </div>

                    <div class="pt-2 col-span-3" x-show="size == 'custom'">
                        <label for="calendar-height" class="block font-medium text-gray-700">Height</label>
                        <input placeholder="auto" type="number" min="150" max="1080" name="calendar-height" id="calendar-height" class="mt-1 text-gray-600 focus:ring-primary-500 focus:border-primary-500 block w-full px-2 shadow-sm border-gray-300 rounded-md" x-model="height" @keyup.debounce.500ms="settingRefreshes('height', $el.value)">
                    </div>

                    <div class="pt-2 col-span-3" x-show="size == 'custom'">
                        <label for="calendar-width" class="block font-medium text-gray-700">Width</label>
                        <input placeholder="auto" type="number" min="300" max="1920" name="calendar-width" id="calendar-width" class="mt-1 text-gray-600 focus:ring-primary-500 focus:border-primary-500 block w-full px-2 shadow-sm border-gray-300 rounded-md" x-model="width" @keyup.debounce.500ms="settingRefreshes('width', $el.value)">
                    </div>
                </div>

                <div class="pt-8">
                    <label for="element_selector" class="block font-medium text-gray-700">Element Selector</label>
                    <input type="text" name="element_selector" id="element_selector" placeholder="auto" class="disabled:text-gray-500 disabled:bg-gray-300 mt-1 text-gray-600 focus:ring-primary-500 focus:border-primary-500 block w-full px-2 shadow-sm border-gray-300 rounded-md" x-model="selector">

                    <x-alert type="notice" class="mt-4" x-show="!selector">
                        Without a selector, the <strong>&lt;script&gt;</strong> tag calling <strong>FantasyCalendar({})</strong> will be replaced.
                    </x-alert>
                </div>

                <div class="flex items-start pt-8">
                    <div class="flex items-center h-5">
                        <input id="comments" name="comments" type="checkbox" class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded" x-model="embedNow">
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

                <div class="relative cursor-pointer" x-data="{ hovered: false }" @mouseenter="hovered=true" @mouseleave="hovered=false">
                    <pre class="text-left bg-gray-800 rounded p-4 leading-8 mt-6 min-w-full text-gray-200 font-mono" @click="copyCode"><code x-ref="codeBlock" x-text="embedCode"></code></pre>
                    <div class="py-1 px-2 text-sm bg-gray-700 absolute top-2 right-2 rounded text-white"
                         x-show="hovered"
                         x-transition:enter="transform ease-out duration-300 transition"
                         x-transition:enter-start="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                         x-transition:enter-end="translate-y-0 opacity-100 sm:translate-x-0"
                         x-transition:leave="transition ease-in duration-100"
                         x-transition:leave-start="opacity-100"
                         x-transition:leave-end="opacity-0"
                    >Click to Copy</div>
                </div>

            </div>
        </div>

        <template x-teleport="body">
            <x-slide-over model="openSidebar">
                <x-slot name="title">
                    Customize your theme
                </x-slot>

                <x-slot name="description">
                    Select your colors below, and you'll see them reflected in your calendar embed.
                </x-slot>

                <template x-for="(field, index) in theme_editing">
                    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
                        <label :for="field.field" class="block text-sm font-medium text-gray-700" x-text="field.title"></label>

                        <div class="relative col-span-2">
                            <input x-model="theme_editing[index].value" type="text" class="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md" />
                            <div class="absolute inset-y-1 right-1.5 w-8 rounded border border-gray-200 shadow cursor-events-none" x-bind:style="`background-color: ${theme_editing[index].value}`"></div>
                            <input type="color" x-model="theme_editing[index].value" class="opacity-0 absolute cursor-pointer inset-y-1 right-1.5 w-8 rounded border border-gray-100 shadow" />
                        </div>
                    </div>
                </template>

                <x-slot name="footer">
                    <x-button role="secondary" @click="cancelTheme">Cancel</x-button>
                    <x-button @click="persistTheme">Save theme</x-button>
                </x-slot>
            </x-slide-over>
        </template>

        <template x-teleport="body">
            <!-- This example requires Tailwind CSS v2.0+ -->
            <!-- Global notification live region, render this permanently at the end of the document -->
            <div aria-live="assertive" class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end">
                <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
                    <template x-for="(notification, index) in notifications">
                        <div class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
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
                                        <p class="text-sm font-medium text-gray-900" x-text="info.title"></p>
                                        <p class="mt-1 text-sm text-gray-500" x-text="info.body"></p>
                                    </div>
                                    <div class="ml-4 flex-shrink-0 flex">
                                        <button class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" @click="remove">
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
        </template>
    </div>
</x-app-layout>
