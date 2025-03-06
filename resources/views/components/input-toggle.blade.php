@php
    $mainAttributes = $attributes->except(['label', 'description', 'name'])
       ->class([
           'col-span-4 flex items-center justify-between',
           'flex-row-reverse space-x-reverse' => $attributes->has('flip'),
           'space-x-2' => $attributes->has('flip') && !str_contains($attributes->get('class'), 'space-x')
       ]);
@endphp

<div {{ $mainAttributes }} x-data="{ value: false }" x-modelable="value">
    <input type="checkbox"  class="hidden" x-model="value" {{ $attributes->whereStartsWith('name') }}>

    <div class="flex-grow flex flex-col">
        <span class="text-sm font-medium text-gray-900 dark:text-gray-300" id="availability-label">{{ $attributes->get('label') }}</span>

        @if($attributes->has('description'))
            <div class="text-sm text-gray-500 dark:text-gray-400" id="availability-description">{{ $attributes->get('description') }}</div>
        @endif

        @if($slot)
            {{ $slot }}
        @endif
    </div>

    <button
        @click="value = !value"
        type="button"
        :class="{'bg-gray-200 dark:bg-gray-700 dark:border-gray-800': !value, 'bg-primary-600 dark:bg-primary-800': value}"
        class="bg-gray-200 dark:bg-gray-700 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        role="switch"
        aria-checked="false"
        aria-labelledby="availability-label"
        aria-describedby="availability-description"
    >
        <span aria-hidden="true" :class="{'translate-x-0': !value, 'translate-x-5': value}" class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
    </button>
</div>
