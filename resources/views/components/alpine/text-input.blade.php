@php
    $wrapperClasses = $attributes->get('wrapper-class');
    $inputAttributes = $attributes
        ->whereDoesntStartWith('wrapper-class')
        ->whereDoesntStartWith('path')
        ->merge(['class' => 'disabled:text-gray-500 disabled:bg-gray-300 dark:bg-gray-700 dark:border-red-600 dark:text-gray-300 text-gray-600 block w-full px-2 py-1 shadow-sm rounded-md'])
@endphp

<div class="{{ $wrapperClasses }}">
    <input
        type="text"
        {{ $inputAttributes }}
        :class="{
            'dark:border-red-600 focus:ring-red-500 focus:border-red-500 border-red-300': hasError({{ $attributes->get('path') }})
        }">

    <small class="text-red-600"
        x-show="hasError({{ $attributes->get('path') }})"
        x-text="getErrorMessage({{ $attributes->get('path') }})">
    </small>
</div>
