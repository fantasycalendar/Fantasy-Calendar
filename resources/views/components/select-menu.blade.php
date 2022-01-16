<div x-data='{
            isOpen: false,
            chosen: {},
            select: function(chosen) {
                this.chosen = chosen;
                this.{{ $model }} = chosen.value;
                this.isOpen = false;
            },
            initial: `{{ $default ?? '' }}`,
            options: JSON.parse(`@json($options)`),
            init: function() {
                let filtered = this.options.filter(option => option.value == this.initial);

                if(filtered.length) this.select(filtered[0])
            }
        }'
     @click.away="isOpen = false"
    >
    <label id="listbox-label" class="block text-sm font-medium text-gray-700">
        {{ $slot }}
    </label>

    <div class="mt-1 relative">
        <button @click="isOpen =! isOpen" type="button" {{ $attributes->merge(['class' => 'bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm']) }} aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
        <span class="block truncate" x-text="chosen.label"></span>
            <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <!-- Heroicon name: solid/selector -->
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </span>
        </button>

        <ul class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm" tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3"
            x-transition:leave="transition ease-in duration-100"
            x-transition:leave-start="opacity-100"
            x-transition:leave-end="opacity-0"
            x-show="isOpen"
            >
            <template x-for="option in options">
                <li class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:text-white hover:bg-green-600"
                    :class="{ 'text-white bg-green-600': chosen.value == option.value }"
                    role="option"
                    @click="select(option)"
                >

                    <span class="font-normal block truncate" :class="{ 'font-semibold': chosen.value == option.value }" x-text="option.label"></span>

                    <!--
                      Checkmark, only display for chosen option.

                      Highlighted: "text-white", Not Highlighted: "text-green-600"
                    -->
                    <span x-show="chosen.value == option.value" class="text-green-600 absolute inset-y-0 right-0 flex items-center pr-4" :class="{ 'text-white': chosen.value == option.value, 'text-green-600': chosen.value != option.value }">
                      <!-- Heroicon name: solid/check -->
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </span>
                </li>
            </template>
        </ul>
    </div>
</div>
