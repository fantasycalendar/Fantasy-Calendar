<div
    x-data="{
        query: '',
        selected: null,
        get filteredOptions() {
            return this.query === ''
                ? {{ $optionsFrom }}
                : {{ $optionsFrom }}.filter((option) => {
                    return option.name.toLowerCase().includes(this.query.toLowerCase())
                })
        },
    }"
    x-modelable="selected"
    {{ $attributes->get('x-model') }}
    class="max-w-xs w-full">
    <!-- Combobox -->
    <div x-combobox x-model="selected" class="relative w-full">
        <div class="group w-full block relative">
            <!-- Combobox Input -->
            <input
                x-combobox:input
                :display-value="option => option?.name ?? 'No categories'"
                @change="query = $event.target.value;"
                class="focus:outline-none focus:ring-0 px-3 py-2 rounded-lg border border-gray-200 bg-[#fff] dark:bg-gray-700 shadow-sm w-full placeholder-gray-400"
                placeholder="Choose option..."
                autocomplete="off" />

            <!-- Combobox Button -->
            <button x-combobox:button class="absolute inset-y-0 right-0 flex items-center pr-2">
                <!-- Heroicons up/down -->
                <svg class="shrink-0 size-5 text-gray-300 group-hover:text-gray-800" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
                    <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
        </div>

        <!-- Combobox Options -->
        <div x-combobox:options x-cloak class="absolute right-0 z-10 mt-2 max-h-80 w-full overflow-y-scroll overscroll-contain rounded-lg border border-gray-200 bg-[#fff] dark:bg-gray-700 p-1.5 shadow-sm outline-none">
            <ul class="">
                <template x-for="option in filteredOptions" :key="option.id">
                    <!-- Combobox Option -->
                    <li
                        x-combobox:option
                        :value="option"
                        :disabled="option.disabled"
                        :class="{
                            'bg-gray-100': $comboboxOption.isActive,
                            'text-gray-800': ! $comboboxOption.isActive && ! $comboboxOption.isDisabled,
                            'text-gray-400 cursor-not-allowed': $comboboxOption.isDisabled,
                        }"
                        class="group flex w-full cursor-default items-center rounded-md px-2 py-1.5 transition-colors">
                        <div class="w-6 shrink-0">
                            <svg class="size-5 shrink-0" x-show="$comboboxOption.isSelected" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd"></path>
                            </svg>
                        </div>

                        <span x-text="option.name"></span>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</div>
