@extends('templates._calendar-tw')

@push('head')
    <script>

        static_data = @json($calendar->static_data);
        dynamic_data = @json($calendar->dynamic_data);
        window.PRELOADED = @json($events);

        function sessionView(){
            return {
                title: "",
                description: "",
                category: -1,
                visible: true,
                submit_event: function(){

                    let year = dynamic_data.year;
                    let timespan = dynamic_data.timespan;
                    let day = dynamic_data.day;

                    var event = {
                        'name': this.title,
                        'description': this.description,
                        "event_category_id": this.category,
                        'data': {
                            'has_duration': false,
                            'duration': 1,
                            'show_first_last': false,
                            'limited_repeat': false,
                            'limited_repeat_num': 1,
                            'conditions': [
                                ['Date', '0', [year, timespan, day]]
                            ],
                            'connected_events': [],
                            'date': [year, timespan, day],
                            'search_distance': 0
                        },
                        'settings': {
                            'color': 'Dark-Solid',
                            'text': 'text',
                            'hide': !this.visible,
                            'print': false,
                            'hide_full': false
                        },
                    };

                    if(this.category != -1){
                        var category = get_category(this.category);
                        if(category.id != -1){
                            event.settings.color = category.event_settings.color;
                            event.settings.text = category.event_settings.text;
                            event.settings.print = category.event_settings.print;
                            event.settings.hide_full = category.event_settings.hide_full;
                        }
                    }

                    submit_new_full_event(event).then(function(){
                        console.log('success')
                    }).catch(error => {
                        console.error(error);
                    });

                }
            }
        }

    </script>
@endpush

@section('content')
    <main x-data="sessionView()">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="grid grid-cols-5 gap-4">
                <div class="col-span-1 grid place-items-center flex flex-column">
                    <div class="text-gray-500 grid place-items-center h-20 mb-4 rounded-full bg-white shadow w-44 h-44">Clock</div>
                    <div class="text-gray-500 grid place-items-center h-20 rounded bg-white shadow w-full h-48">Calendar</div>
                </div>
                <div class="shadow rounded bg-white col-span-4">
                    <div class=" m-5">
                        <div class="mb-5">
                            <label for="title" class="sr-only">Title</label>
                            <input type="text" id="title" class="shadow-sm focus:ring-green-600 focus:border-green-600 block w-full sm:text-sm border-gray-400 rounded-sm" x-model="title" placeholder="Event Title">
                        </div>

                        <x-easy-mde name="description" x-model="description" :options="['maxHeight' => '200px']" />

                        <div class="flex justify-between items-center">
                            <div>
                                <select name="Event Category" id="category" x-model="category" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-600 focus:border-green-600 sm:text-sm rounded-md">
                                    <option value="-1">Select category</option>
                                    @foreach($calendar->event_categories as $category)
                                        <option value="{{ $category->id }}">{{ $category->name }}</option>
                                    @endforeach
                                </select>
                            </div>

                            <div class="flex items-center">
                                <x-input-toggle label="Visible to players" x-model="visible" bind="visible"></x-input-toggle>

                                <label for="visible" class="ml-2 text-sm text-gray-600">Visible to players</label>

                                <button type="button" @click="submit_event" class="relative inline-flex items-center ml-5 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-all duration-300 ease-in-out">
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
