<a {{ $attributes->merge(['class' => "$sizeClasses $roleClasses inline-flex items-center border font-medium shadow-sm focus:outline-none focus:ring-offset-2"]) }}>
    {{ $slot }}
</a>
