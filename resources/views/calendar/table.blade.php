@extends('templates._calendar-tw')

@section('content')
    <main>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="grid grid-cols-5 gap-4">
                <div class="col-span-1 grid place-items-center flex flex-column">
                    <div class="text-gray-500 grid place-items-center h-20 mb-4">Clock</div>
                    <div class="text-gray-500 grid place-items-center h-20">Calendar</div>
                </div>
                <div class="shadow rounded bg-white col-span-4">
                    <div class=" m-5">
                        <div class="mb-5">
                            <label for="email" class="sr-only">Email</label>
                            <input type="text" id="email" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-400 rounded-sm" placeholder="Event Title">
                        </div>
                        <x-easy-mde name="description" :options="['maxHeight' => '300px']" />
                    </div>
                </div>
            </div>

            <hr class="my-5 bg-gray-800">

            <div class="grid grid-cols-5 gap-4">
                <div class="col-span-1 h-full grid place-items-center">
                    WHEEEE
                </div>

                <div class="col-span-4">
                    @foreach($events as $event)
                        <x-timeline-event :title="$event->name">
                            {!! $event->description !!}
                        </x-timeline-event>
                    @endforeach
                </div>
            </div>

        </div>
    </main>

@endsection
