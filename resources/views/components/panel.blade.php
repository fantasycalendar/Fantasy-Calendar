<div {{ $attributes->merge(['class' => 'shadow sm:rounded-md sm:overflow-hidden']) }}>
    <div class="bg-white dark:bg-gray-800 dark:text-gray-300 py-6 px-4 space-y-6 sm:p-6">
        {{ $slot }}
    </div>

    @unless(isset($footer))
        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-700 text-right sm:px-6">
            <x-button type="submit">Save</x-button>
        </div>
    @else
        {{ $footer }}
    @endunless
</div>
