@if($attributes->has('label'))
    <label for="{{ $attributes->get('name') }}" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $attributes->get('label') }}</label>
@endif
<input type="text" {{ $attributes->merge(['class' => 'disabled:text-gray-500 disabled:bg-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 mt-1 text-gray-600 focus:ring-primary-500 focus:border-primary-500 block w-full px-2 shadow-sm border-gray-300 rounded-md']) }}>
