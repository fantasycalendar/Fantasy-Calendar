<div class="col-span-4 flex items-center justify-between" x-data="{ {{ $attributes->get('name') }}: {{ $attributes->get('value') ?? old($attributes->get('name')) ?? 'false' }} }">
    <input type="checkbox" name="{{ $attributes->get('name') }}" class="hidden" x-model="{{ $attributes->get('name') }}">

    <span class="flex-grow flex flex-col">
        <span class="text-sm font-medium text-gray-900 dark:text-gray-300" id="availability-label">{{ $attributes->get('label') }}</span>
        @if($attributes->has('description'))
            <span class="text-sm text-gray-500 dark:text-gray-400" id="availability-description">{{ $attributes->get('description') }}</span>
        @endif
    </span>

    <button @click="{{ $attributes->get('name') }} = !{{ $attributes->get('name') }}" type="button" :class="{'bg-gray-200 dark:bg-gray-700': !{{ $attributes->get('name') }}, 'bg-primary-600': {{ $attributes->get('name') }}}" class="bg-gray-200 dark:bg-gray-700 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" role="switch" aria-checked="false" aria-labelledby="availability-label" aria-describedby="availability-description">
        <span aria-hidden="true" :class="{'translate-x-0': !{{ $attributes->get('name') }}, 'translate-x-5': {{ $attributes->get('name') }}}" class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
    </button>
</div>
