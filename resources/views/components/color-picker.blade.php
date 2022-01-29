<div {{ $attributes->merge(['class' => '']) }} class="relative">
    <input x-model="{{ $attributes->get('model') }}" type="text" name="{{ $attributes->get('name') }}" id="picker_{{ $attributes->get('name') }}" autocomplete="family-name" class="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md" />
    <input type="color" x-model="{{ $attributes->get('model') }}" class="absolute cursor-pointer inset-y-1 right-1.5 w-6 rounded border border-gray-100 shadow" />
</div>
