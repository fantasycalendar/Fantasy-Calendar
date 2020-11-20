@extends('templates._calendar-tw')

@section('content')
    <main x-data="{ visible: true }">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="grid grid-cols-5 gap-4">
                <div class="col-span-1 grid place-items-center flex flex-column">
                    <div class="text-gray-500 grid place-items-center h-20 mb-4 rounded-full bg-white shadow w-44 h-44">Clock</div>
                    <div class="text-gray-500 grid place-items-center h-20 rounded bg-white shadow w-full h-48">Calendar</div>
                </div>
                <div class="shadow rounded bg-white col-span-4">
                    <div class=" m-5">
                        <div class="mb-5">
                            <label for="email" class="sr-only">Email</label>
                            <input type="text" id="email" class="shadow-sm focus:ring-green-600 focus:border-green-600 block w-full sm:text-sm border-gray-400 rounded-sm" placeholder="Event Title">
                        </div>

                        <x-easy-mde name="description" :options="['maxHeight' => '200px']" />

                        <div class="flex justify-between items-center">
                            <div>
                                <select name="Event Category" id="category" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-600 focus:border-green-600 sm:text-sm rounded-md">
                                    <option value="">Select category</option>
                                    @foreach($calendar->event_categories as $category)
                                        <option value="{{ $category->id }}">{{ $category->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            <div class="flex items-center">
                                <x-input-toggle label="Visible to players" bind="visible"></x-input-toggle>

                                <label for="visible" class="ml-2 text-sm text-gray-600">Visible to players</label>

                                <button type="button" class="relative inline-flex items-center ml-5 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-all duration-300 ease-in-out">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="my-5 bg-gray-800">

            <div class="grid grid-cols-5 gap-4">
                <div class="col-span-1 h-full grid place-items-center">
                    <div class="h-full w-2 bg-gray-300 rounded-full"></div>
                </div>

                <div class="col-span-4">
                    @foreach($events as $event)
                        <x-timeline-event title="{{ $event->name }}" date="{{ $event->date }}">
                            {!! $event->description !!}
                        </x-timeline-event>
                    @endforeach
                </div>
            </div>

        </div>
    </main>

@endsection
