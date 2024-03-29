@props(['savebutton' => false, 'fullwidth' => false])

<div {{ $attributes->merge(['class' => 'shadow sm:rounded-md sm:overflow-hidden']) }}>
    <div class="bg-white dark:bg-gray-800 dark:text-gray-300 space-y-6 @unless($fullwidth) py-6 px-4 sm:p-6 @endunless">
        {{ $slot }}
    </div>

    @if(isset($footer))
        {{ $footer }}
    @elseif(isset($footer_buttons))
        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-700 text-right sm:px-6 space-x-2">
            {{ $footer_buttons }}
        </div>
    @elseif($savebutton)
        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-700 text-right sm:px-6">
            <x-button type="submit">Save</x-button>
        </div>
    @endif
</div>
