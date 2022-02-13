@if($attributes->has('label'))
    <label for="{{ $attributes->get('name') }}" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $attributes->get('label') }}</label>
@endif

@error($attributes->get('error-on') ?? $attributes->get('name'))
    <input type="{{ $attributes->get('type') ?? 'text' }}" {{ $attributes->merge(['class' => 'disabled:text-gray-500 disabled:bg-gray-300 dark:bg-gray-700 dark:border-red-600 dark:text-gray-400 text-gray-600 focus:ring-red-500 focus:border-red-500 block w-full px-2 shadow-sm border-red-300 rounded-md']) }}>
    <div class="text-red-600">{{ $message }}</div>
@else
    <input type="{{ $attributes->get('type') ?? 'text' }}" {{ $attributes->merge(['class' => 'disabled:text-gray-500 disabled:bg-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 text-gray-600 focus:ring-primary-500 focus:border-primary-500 block w-full px-2 shadow-sm border-gray-300 rounded-md']) }}>
@enderror
