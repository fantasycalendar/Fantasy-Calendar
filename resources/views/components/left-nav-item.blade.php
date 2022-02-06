<a href="{{ route($attributes->get('route') ?? '/') }}" class="@if(request()->routeIs($attributes->get('route') ?? '/')) bg-gray-50 text-primary-600 hover:bg-white dark:bg-gray-700 dark:text-primary-700 dark:hover:bg-gray-600 @else text-gray-900 dark:text-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 hover:bg-gray-50 @endif group rounded-md px-3 py-2 flex items-center text-sm font-medium">
    <i class="fa fa-{{ $attributes->get('icon') }} @if(request()->routeIs($attributes->get('route') ?? '/')) text-primary-500 @else text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300 @endif -ml-1 mr-3 h-6 w-6 text-xl flex items-center justify-center"></i>
    <span class="truncate"> {{ $attributes->get('label') }} </span>
</a>
