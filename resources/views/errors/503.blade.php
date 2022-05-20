<x-error-layout>
    <h1 class="text-4xl font-['Cabin_Sketch']">Fantasy Calendar is down for maintenance.</h1>
    <h2>{{ json_decode(Cache::get(config('app.maintenance_key')), true)['message'] ?? "We'll be right back." }}</h2>
</x-error-layout>
