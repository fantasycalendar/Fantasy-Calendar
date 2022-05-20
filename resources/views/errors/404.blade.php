@section('title')404 - Not Found -@endsection
<x-error-layout>
    <h1 class="text-6xl text-gray-700 dark:text-gray-200 font-['Cabin_Sketch']">404:<small>{{ isset($resource) ? $resource : "Page" }} Not Found</small></h1>

    <p class="text-gray-800 dark:text-gray-300">
        Let's face it. You probably expected there to be something here.<br>
        <br>
        But the reality is, now we're <i>both</i> confused.
    </p>
</x-error-layout>
