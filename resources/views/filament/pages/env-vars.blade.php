<x-filament::page>
    <div class="grid divide-y divide-gray-700">
        @foreach($_ENV as $name => $var)
            <div class="grid md:grid-cols-2 py-2 mb-4 md:mb-0">
                <div class="font-bold text-lg md:text-base">{{ $name }}</div>
                <div class="overflow-x-auto">{{ $var }}</div>
            </div>
        @endforeach
    </div>
</x-filament::page>
