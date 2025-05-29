@props(['calendar' => null])

@if(request()->is('calendars/*/edit') && $calendar->isLinked())

    <ul class="list-group">

        @php
            $eras = Arr::get($calendar->static_data, 'eras');
        @endphp

        @foreach ($eras as $era)
            <li class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                    <strong>{{ $era['name'] }}</strong>
                    @if($era['settings']['starting_era'])
                        <small>Starting Era</small>
                    @endif
                </div>
                @if(!$era['settings']['starting_era'])
                    <div class='mt-2'>
                        Year: {{ $era['date']['year'] }}<br>
                        Month: {{ $era['date']['timespan']+1 }}<br>
                        Day: {{ $era['date']['day'] }}<br>
                    </div>
                @endif
            </li>
        @endforeach

    </ul>

    <p class='mb-0 mt-1'><a onclick="linked_popup();" href='#'>Why can't I edit the eras?</a></p>
@else
    <div class='flex bold-text'>
        New Era:
    </div>

    <div class="input-group">
        <input type='text' class='form-control' placeholder='Era name' x-model="era_name">

        <div class="input-group-append">
            <button type='button' class='btn btn-primary' @click="addEra"><i class="fa fa-plus"></i></button>
        </div>
    </div>

    <div class='sortable'>
        <template x-for="(era, index) in eras">
            <x-sortable-item deleteFunction="removeEra(index)">
                <x-slot:inputs>
                    <input type='text' class='name-input small-input form-control' x-model.lazy='era.name'/>
                </x-slot:inputs>

                <div class='flex flex-col space-y-2 py-2'>
                    <x-alpine.check-input id="index + '_use_custom_format'" x-model='era.settings.use_custom_format'>
                        Custom year header formatting
                    </x-alpine.check-input>

                    <div>
                        Format:

                        <input type='text' class='form-control small-input'
                            x-model.lazy='era.formatting'
                            :disabled='!era.settings.use_custom_format'
                        />
                    </div>
                </div>

                <div class='separator'></div>

                <div class='flex flex-col space-y-2 py-2'>
                    <x-alpine.check-input id="index + '_show_as_event'" x-model='era.settings.show_as_event'>
                        Show as event
                    </x-alpine.check-input>

                    {{-- TODO: Make the HTML editor .~=^=~.pretty.~=^=~. --}}
                    <div class='btn btn-outline-primary w-full' @click="$dispatch('html-editor-modal-edit-html', { era_id: index })" x-show='era.settings.show_as_event'>
                        Edit event description
                    </div>

                    <div x-show='era.settings.show_as_event'>
                        Event category:

                        <select x-model="era.settings.event_category_id" class='form-control mt-0.5' >
                            <option value="-1">No default category</option>

                            <template x-for="category in event_categories">
                                <option :value="category.id" x-text="category.name" :selected="category.id == era.settings.event_category_id"></option>
                            </template>
                        </select>
                    </div>
                </div>

                <div class='separator'></div>

                <div class='flex flex-col py-2'>
                    <x-alpine.check-input
                        id="index + '_starting_era'"
                        x-model='era.settings.starting_era'
                        disabled-when="!canBeStartingEra(index)"
                        disabled-wrapper-classes="rounded-t"
                        enabled-wrapper-classes="rounded"
                        >
                        Is starting era (like B.C.)
                    </x-alpine.check-input>

                    <div class='border rounded-b text-center' x-show="!canBeStartingEra(index)">
                        <div class="py-2">
                            <i class="fa fa-exclamation-triangle text-orange-500 dark:text-orange-200"></i>
                            There can only be one starting era.
                        </div>
                    </div>
                </div>

                <template x-if='!era.settings.starting_era'>
                    <div class='flex flex-col space-y-2'>
                        <div class='date_control flex flex-col p-1.5 space-y-1 border rounded'>
                            <strong>Date:</strong>

                            <input type='number'
                                step="1.0"
                                class='date form-control small-input'
                                x-model.lazy.number='era.date.year'
                                @change="updateEraEpoch(era)" />

                            <select type='number'
                                class='date custom-select form-control'
                                x-model.lazy.number='era.date.timespan'
                                @change="updateEraEpoch(era)"
                                >
                                <template x-for="(month, month_index) in getMonthsInYear(era.date.year)">
                                    <option :value="month_index" x-text="month.name"
                                    :selected="month_index === era.date.timespan"
                                    :disabled="month.disabled"></option>
                                </template>
                            </select>

                            <select type='number'
                                class='date custom-select form-control'
                                x-model.lazy.number='era.date.day'
                                @change="updateEraEpoch(era)">
                                <template
                                    x-for="(day, day_index) in getDaysForMonth(era.date.year, era.date.timespan)">
                                    <option :value="day_index+1" x-text="day"
                                    :selected="day_index+1 === era.date.day"></option>
                                </template>
                            </select>
                        </div>

                        <div class='btn btn-secondary w-full' @click="previewEraDate(era)">
                            Preview era start date
                        </div>

                        <div class="flex flex-col space-y-1">
                            <strong class="mt-2">Date settings:</strong>

                            <x-alpine.check-input id="index + '_restart_year'" x-model='era.settings.restart'>
                                Restarts year count
                            </x-alpine.check-input>

                            <x-alpine.check-input
                                id="index + '_ends_year'"
                                x-model='era.settings.starting_era'
                                disabled-when="!season_settings.periodic_seasons"
                                >
                                Ends year prematurely

                                <p class='m-0 mt-2 ends_year_explaination font-italic small-text'
                                    x-show="!season_settings.periodic_seasons">
                                    This is disabled because you have seasons based on dates - that means that the
                                    calendar cannot end its years early because some seasons could disappear.</p>
                            </x-alpine.check-input>
                        </div>
                    </div>
                </template>
            </x-sortable-item>
        </template>
    </div>

@endif
