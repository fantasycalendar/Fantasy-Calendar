<input
    type="{{ $attributes->get('type') ?? 'text' }}"
    @if($attributes->has('model'))
        x-model.lazy="{{ $attributes->get('model') }}"
    @endif
    @if($attributes->has('tooltip'))
        data-pt-title="{{ $attributes->get('tooltip') }}"
        data-pt-position="{{ $attributes->get('tooltip-position') ?? 'top' }}"
    @endif

    {{ $attributes->filter(fn (string $value, string $key) => !in_array($key, ['model', 'tooltip', 'tooltip-position']))->merge(['class' => 'protip disabled:text-gray-500 disabled:bg-gray-300 dark:bg-gray-700 dark:border-red-600 dark:text-gray-300 text-gray-600 focus:ring-red-500 focus:border-red-500 block w-full px-2 shadow-sm border-red-300 rounded-md']) }}>

<small class="text-red-600" x-show="hasError({{ $attributes->get('path') }})"
       x-text="getError({{ $attributes->get('path') }})"></small>
