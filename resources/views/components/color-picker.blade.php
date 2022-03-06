<div {{ $attributes->class(['relative']) }}>
    <input name="{{ $attributes->get('name') }}_text" x-model="{{ $attributes->get('model') }}" type="text" class="{{ $attributes->get('input-class') }} max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
    <div class="absolute inset-y-1 right-1.5 w-8 rounded border border-gray-200 shadow cursor-events-none dark:border-gray-700" x-bind:style="`background-color: ${{ '{' . $attributes->get('model') . '}' }}`"></div>
    <input name="{{ $attributes->get('name') }}" type="color" x-model="{{ $attributes->get('model') }}" class="opacity-0 absolute cursor-pointer inset-y-1 right-1.5 w-8 rounded border border-gray-100 dark:border-gray-700 shadow" />
</div>
