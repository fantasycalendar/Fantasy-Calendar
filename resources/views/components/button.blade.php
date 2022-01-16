<div>
    <button {{ $attributes->merge(['class' => "$sizeClasses inline-flex items-center border border-transparent font-medium shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"]) }} type="button">
        {{ $slot }}
    </button>
</div>-
