@extends('templates._calendar-tw')

@push('head')
    <style>
        [x-cloak] { display: none; }
    </style>
    <script>

        static_data = @json($calendar->static_data);
        dynamic_data = @json($calendar->dynamic_data);

        // Eww. This primes legacy code doing heavy-lifting. We should solve this before calling it done.
        window.event_categories = @json($calendar->event_categories);

        function sessionView(){
            return {
                title: "",
                description: "",
                category: -1,
                visible: true,
                eventcontent: "",
                dynamic_data: this.dynamic_data,
                events: @json($events),
                error: false,
                submit_event: function(){

                    let year = this.dynamic_data.year;
                    let timespan = this.dynamic_data.timespan;
                    let day = this.dynamic_data.day;

                    var event = {
                        'name': this.title,
                        'description': this.description,
                        "event_category_id": this.category,
                        "calendar_id": {{ $calendar->id }},
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
                        console.log(category);
                        if(category.id != -1){
                            event.settings.color = category.event_settings.color;
                            event.settings.text = category.event_settings.text;
                            event.settings.print = category.event_settings.print;
                            event.settings.hide = category.event_settings.hide;
                        }
                    }

                    this.eventcontent = JSON.stringify(event);

                    // Warning: DIRTY HACK
                    let parent = this;
                    submit_new_full_event(event).then(function(result){
                        parent.events.unshift(result);

                        parent.title = parent.description = "";

                        console.log('success')
                    }).catch(error => {
                        parent.error = error;

                        console.error(error);
                    });

                    console.log(this.error);

                },
                clearError: function() {
                    this.error = false;
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
                    <div class="text-gray-500 grid place-items-center h-20 rounded bg-white shadow w-full h-48">
                        <div class="flex items-center justify-between my-2 px-2">
                            <div class="flex-grow-0">
                                <button type="button" @click="dynamic_data.timespan--" class="items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-grey-200 bg-white hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-all duration-300 ease-in-out">
                                    <i class="fa fa-minus"></i>
                                </button>
                            </div>
                            <input class="w-3/5" type="number" x-model="dynamic_data.timespan" />
                            <div class="flex-grow-0">
                                <button type="button" @click="dynamic_data.timespan++" class="items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-grey-200 bg-white hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-all duration-300 ease-in-out">
                                    <i class="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>

                        <div class="flex items-center justify-between my-2 px-2">
                            <div class="flex-grow-0">
                                <button type="button" @click="dynamic_data.day--" class="items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-grey-200 bg-white hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-all duration-300 ease-in-out">
                                    <i class="fa fa-minus"></i>
                                </button>
                            </div>
                            <input class="w-3/5" type="number" x-model="dynamic_data.day" />
                            <div class="flex-grow-0">
                                <button type="button" @click="dynamic_data.day++" class="items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-grey-200 bg-white hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-all duration-300 ease-in-out">
                                    <i class="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>

                        <div class="flex items-center justify-between my-1 px-2">
                            <div class="flex-grow-0">
                                <button type="button" @click="dynamic_data.year--" class="items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-grey-200 bg-white hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-all duration-300 ease-in-out">
                                    <i class="fa fa-minus"></i>
                                </button>
                            </div>
                            <input class="w-3/5" type="number" x-model="dynamic_data.year" />
                            <div class="flex-grow-0">
                                <button type="button" @click="dynamic_data.year++" class="items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-grey-200 bg-white hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-all duration-300 ease-in-out">
                                    <i class="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="shadow rounded bg-white col-span-4">
                    <div class=" m-5">
                        <div class="mb-5">
                            <label for="title" class="sr-only">Title</label>
                            <input type="text" id="title" class="shadow-sm focus:ring-green-600 focus:border-green-600 block w-full sm:text-sm border-gray-400 rounded-sm" @click="clearError" @keydown="clearError" x-model="title" placeholder="Event Title">
                        </div>

                        <textarea name="description" class="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md h-48 mb-6" @click="clearError" @keydown="clearError" x-model="description"></textarea>

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

                                <button type="button" @click="submit_event" :class="{'bg-red-800': error, 'bg-green-700': !error}" class="relative inline-flex items-center ml-5 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-all duration-300 ease-in-out">
                                    Save
                                </button>
                            </div>
                        </div>

                        <div class="rounded-md bg-red-200 p-4 mt-2" x-show="error" x-cloak>
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <!-- Heroicon name: x-circle -->
                                    <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div class="ml-3">
                                    <h3 class="text-sm font-medium text-red-800">
                                        An error occurred!
                                    </h3>
                                    <div class="mt-2 text-sm text-red-700" x-text="error"></div>
                                </div>
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
                    <template x-for="eventdata in events">
                        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
                            <div class="bg-white px-4 py-3 border-b border-gray-200 sm:px-6">
                                <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                                    <div class="ml-4 mt-2">
                                        <h3 class="text-lg leading-6 font-medium text-gray-900" x-text="eventdata.name"></h3>
                                    </div>
                                    <div class="ml-4 mt-2 flex-shrink-0">
                                        <span x-text="eventdata.date"></span>
                                        <button type="button" class="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ease-in-out">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>


                            <div class="px-4 py-5 sm:px-6">
                                <div class="mt-1 text-sm text-gray-700" x-html="eventdata.description">
                                </div>
                            </div>
                        </div>
                    </template>

                </div>
            </div>

        </div>
    </main>

@endsection
