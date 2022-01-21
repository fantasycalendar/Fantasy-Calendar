<button {{ $attributes->merge(['class' => "$sizeClasses $roleClasses inline-flex items-center border font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"]) }} type="button">
    {{ $slot }}
</button>
