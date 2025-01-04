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

    <p class='mb-0 mt-3'><a onclick="linked_popup();" href='#'>Why can't I edit the eras?</a></p>

@else

    <div class='row no-gutters bold-text'>
        <div class='col'>
            New Era:
        </div>
    </div>

    <div class='add_inputs eras row no-gutters'>
        <div class="input-group">
            <input type='text' class='form-control' placeholder='Era name' x-model="era_name">
            <div class="input-group-append">
                <button type='button' class='btn btn-primary' @click="addEra"><i class="fa fa-plus"></i></button>
            </div>
        </div>
    </div>

    <div class='sortable'>
        <template x-for="(era, era_index) in eras">
            <div class='sortable-container list-group-item collapsible p-2 first-of-type:rounded-t'
                 :class="{'collapsed': !collapsed}"
                 x-data='{ collapsed: false }'
            >
                <div class='flex items-center w-full gap-x-2' x-show="deleting !== era_index">
                    <div class='handle fa fa-bars'></div>
                    <div class='cursor-pointer text-xl fa'
                         :class="{ 'fa-caret-square-up': !collapsed, 'fa-caret-square-down': collapsed }"
                         @click="collapsed = !collapsed"></div>
                    <input type='text' class='name-input small-input form-control' x-model.lazy='era.name'/>
                    <button class="btn btn-danger w-10" @click="deleting = era_index">
                        <i class="fa fa-trash text-lg"></i>
                    </button>
                </div>

                <div x-show="deleting === era_index" class="flex items-center w-full gap-x-2.5" x-cloak>
                    <button class="btn btn-success w-10 !px-0 text-center" @click="removeEra(era_index)">
                        <i class="fa fa-check text-lg"></i>
                    </button>

                    <div class="flex-grow">Are you sure?</div>

                    <button class="btn btn-danger w-10 !px-0 text-center" @click="deleting = -1">
                        <i class="fa fa-times text-lg"></i>
                    </button>
                </div>

                <div class='collapse-container container mb-2'>
                    <div class='row no-gutters my-1'>
                        <div class='form-check col-12 py-2 border rounded'>
                            <input type='checkbox' :id='era_index + "_use_custom_format"'
                                   class='form-check-input use_custom_format' x-model='era.settings.use_custom_format'
                            />
                            <label :for='era_index + "_use_custom_format"' class='form-check-label ml-1'>
                                Custom year header formatting
                            </label>
                        </div>
                    </div>
                    <div class='row mt-1'>
                        <div class='col'>
                            Format:
                            <input type='text' class='form-control small-input protip'
                                   x-model.lazy='era.formatting' :disabled='!era.settings.use_custom_format'
                                   data-pt-position="right" data-pt-title="Check out the wiki on this by
                            clicking on the question mark on the 'Eras' bar!"/>
                        </div>
                    </div>
                    <div class='row my-1 no-gutters'>
                        <div class='col'>
                            <div class='separator'></div>
                        </div>
                    </div>
                    <div class='row no-gutters my-1'>
                        <div class='form-check col-12 py-2 border rounded'>
                            <input type='checkbox' :id='era_index + "_show_as_event"'
                                   class='form-check-input show_as_event' x-model='era.settings.show_as_event'/>
                            <label :for='era_index + "_show_as_event"' class='form-check-label ml-1'>
                                Show as event
                            </label>
                        </div>
                    </div>
                    <div class='row my-2' x-show='era.settings.show_as_event'>
                        <div class='col'>
                            <div class='btn btn-outline-primary full era_description html_edit'>Edit event
                                description
                            </div>
                        </div>
                    </div>
                    <div class='era_event_category_container' x-show='era.settings.show_as_event'>
                        <div class='row mt-2'>
                            <div class='col'>
                                Event category:
                                <select type='text' class='custom-select form-control event-category-list'
                                        x-model='era.settings.event_category_id'>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class='row my-1 no-gutters'>
                        <div class='col'>
                            <div class='separator'></div>
                        </div>
                    </div>
                    <div class='row no-gutters my-1'>
                        <div class='form-check col-12 py-2 border rounded'>
                            <input type='checkbox' :id='era_index + "_starting_era"'
                                   class='form-check-input starting_era' x-model='era.settings.starting_era'/>
                            <label :for='era_index + "_starting_era"' class='form-check-label ml-1'>
                                Is starting era (like B.C.)
                            </label>
                        </div>
                    </div>
                    <template x-if='!era.settings.starting_era'>
                        <div class='date_control_container'>
                            <div class='row my-2'>
                                <div class='col'>
                                    <strong>Date:</strong>
                                    <div class='date_control'>
                                        <div class='row my-2'>
                                            <div class='col'>
                                                <input type='number' step="1.0"
                                                       class='date form-control small-input'
                                                       x-model.lazy.number='era.date.year'
                                                       @change="updateEraEpoch(era)"
                                                />
                                            </div>
                                        </div>
                                        <div class='row my-2'>
                                            <div class='col'>
                                                <select type='number'
                                                        class='date custom-select form-control'
                                                        x-model.lazy.number='era.date.timespan'
                                                        @change="updateEraEpoch(era)"
                                                >
                                                    <template x-for="(month, index) in months">
                                                        <option :value="index" x-text="month.name"
                                                                :selected="index === era.date.timespan"
                                                                :disabled="month.disabled"></option>
                                                    </template>
                                                </select>
                                            </div>
                                        </div>
                                        <div class='row my-2'>
                                            <div class='col'>
                                                <select type='number'
                                                        class='date custom-select form-control'
                                                        x-model.lazy.number='era.date.day'
                                                        @change="updateEraEpoch(era)"
                                                >
                                                    <template
                                                        x-for="(day, index) in getDaysForMonth(era.date.timespan)">
                                                        <option :value="index+1" x-text="day"
                                                                :selected="index+1 === era.date.day"></option>
                                                    </template>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class='row my-2'>
                                <div class='col'>
                                    <div class='btn btn-secondary full' @click="previewEraDate(era)">Preview era start date</div>
                                </div>
                            </div>
                            <div class='row my-2 bold-text'>
                                <div class='col'>
                                    Date settings:
                                </div>
                            </div>
                            <div class='row no-gutters my-1'>
                                <div class='form-check col-12 py-2 border rounded'>
                                    <input type='checkbox' :id='era_index + "_restart_year"'
                                           class='form-check-input' x-model='era.settings.restart'/>
                                    <label :for='era_index + "_restart_year"' class='form-check-label ml-1'>
                                        Restarts year count
                                    </label>
                                </div>
                            </div>
                            <div class='row no-gutters my-1'>
                                <div
                                    class='form-check col-12 py-2 border rounded'
                                    :class="{ 'disabled': !season_settings.periodic_seasons }">
                                    <input type='checkbox' :id='era_index + "_ends_year"'
                                           class='form-check-input ends_year'
                                           :disabled="!season_settings.periodic_seasons"
                                           x-model='era.settings.ends_year'/>
                                    <label :for='era_index + "_ends_year"' class='form-check-label ml-1'>
                                        Ends year prematurely
                                    </label>
                                    <p class='m-0 mt-2 ends_year_explaination font-italic small-text'
                                       x-show="!season_settings.periodic_seasons">
                                        This is disabled because you have seasons based on dates - that means that the
                                        calendar cannot end its years early because some seasons could disappear.</p>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </div>

@endif
